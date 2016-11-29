using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Windows.ApplicationModel.Background;
using Windows.System.Threading;
using CottonwoodRfidReader;
using Windows.Devices.SerialCommunication;
using Windows.Devices.Enumeration;
using Windows.Networking.Connectivity;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

// The Background Application template is documented at http://go.microsoft.com/fwlink/?LinkID=533884&clcid=0x409

namespace RfidScanner
{
    public sealed class StartupTask : IBackgroundTask
    {
        private BackgroundTaskDeferral deferral;
        private ThreadPoolTimer timer;
        private string uartBridgeName = "CP2102 USB to UART Bridge Controller";
        private Cottonwood reader = null;
        private string ipAddress = null;

        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            //keeps this process alive in the OS
            deferral = taskInstance.GetDeferral();

            if (SetDeviceIpv4Address())
            {
                bool isStartedUp = await ConfigureCottonwood();
                if (isStartedUp)
                {
                    // Only kick off timer if everything gets configured properly.
                    // Reads will occur every 2 seconds.
                    timer = ThreadPoolTimer.CreatePeriodicTimer(Timer_Tick, TimeSpan.FromMilliseconds(2000));
                }
            }
        }

        // Checks individual tags as they pass over
        private async void Timer_Tick(ThreadPoolTimer timer)
        {
            try
            {
                //perform inventory scan and read available RFID tags
                var tagInventory = await reader.PerformInventoryScan();
                if (tagInventory.Count() > 0)
                {
                    //assemble readings in the expected structure
                    List<TrackerReadingModel> readings = new List<TrackerReadingModel>();
                    foreach (var tag in tagInventory)
                    {
                        TrackerReadingModel reading = new TrackerReadingModel();
                        reading.IpAddress = ipAddress;
                        reading.TagId = BitConverter.ToString(tag);
                        reading.Reading = DateTime.Now;
                        readings.Add(reading);
                    }

                    //// Debugging
                    //foreach (var reading in readings)
                    //{
                    //    // Debug to make sure we're getting all the readings here.
                    //    System.Diagnostics.Debug.WriteLine(reading.TagId);
                    //}
                    //System.Diagnostics.Debug.WriteLine("");

                    string output = JsonConvert.SerializeObject(readings);
                    //send reading data to the web server
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        var response = await client.PostAsync("http://localhost:1338", new StringContent(output.ToString(), Encoding.UTF8, "application/json"));
                    }

                    
                    //var httpWebRequest = (HttpWebRequest)WebRequest.Create("http://localhost:1338");
                    //httpWebRequest.ContentType = "application/json";
                    //httpWebRequest.Method = "POST";
                    //Stream stream = httpWebRequest.GetRequestStream();

                    //using (var streamWriter = new StreamWriter(stream))
                    //{
                    //    System.Diagnostics.Debug.Write(output);
                    //    streamWriter.Write(output);
                    //}
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        /// <summary>
        /// Internal encapsulation class of a reading.
        /// This is the structure that the ASP.NET Web API
        /// service is expecting.
        /// </summary>
        internal class TrackerReadingModel
        {
            public string IpAddress { get; set; }
            public string TagId { get; set; }
            public DateTime Reading { get; set; }
        }

        /// <summary>
        /// Obtains the IP address of the Raspberry Pi.
        /// The IP is used to identify the Pi.
        /// </summary>
        /// <returns>Is Successful?</returns>
        private bool SetDeviceIpv4Address()
        {
            var hostInfo = NetworkInformation.GetHostNames().Where(x => x.Type == Windows.Networking.HostNameType.Ipv4).FirstOrDefault();
            if (hostInfo != null)
            {
                ipAddress = hostInfo.RawName;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Retrieves the serial device, instantiates and configures
        /// the Cottonwood board. Also turns on the antenna so that
        /// the device is ready to perform inventory scans.
        /// </summary>
        /// <returns>If configuration successful.</returns>
        private async Task<bool> ConfigureCottonwood()
        {
            // Retrieve serial device representing the Cottonwood board.
            string deviceQuery = SerialDevice.GetDeviceSelector();
            var discovered = await DeviceInformation.FindAllAsync(deviceQuery);
            var readerInfo = discovered.Where(x => x.Name == uartBridgeName).FirstOrDefault();
            // If serial device found...
            if (readerInfo != null)
            {
                var bridgeDevice = await SerialDevice.FromIdAsync(readerInfo.Id);
                // If bridge device retrieved...
                if (bridgeDevice != null)
                {
                    // Instantiate the Cottonwood with the serial device.
                    reader = new Cottonwood(bridgeDevice);
                    bool isAntennaOn = await reader.TurnOnAntenna();
                    if (isAntennaOn)
                    {
                        // Set USA frequency.
                        var isUsFrequency = await reader.ConfigureUnitedStatesFrequency();
                        if (isUsFrequency)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }
}
