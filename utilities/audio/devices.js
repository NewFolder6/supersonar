const { exec } = require('child_process');
const os = require('os');

function getAudioDevices() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command;
    
    if (platform === 'linux') {
      command = 'arecord -L';
    } else if (platform === 'win32') {
      // Use a more detailed PowerShell command to get both input and output devices
      command = 'powershell "$devices = Get-CimInstance Win32_SoundDevice; $devices | ForEach-Object { $dev = $_; $props = Get-CimInstance Win32_PnPEntity | Where-Object { $_.PNPDeviceID -eq $dev.PNPDeviceID }; [PSCustomObject]@{ Name = $dev.Name; DeviceID = $dev.DeviceID; Status = $dev.Status; PNPDeviceID = $dev.PNPDeviceID; ConfigManagerErrorCode = $dev.ConfigManagerErrorCode; Caption = $props.Caption; Description = $props.Description; } } | ConvertTo-Json -Depth 3"';
    } else {
      return reject(new Error(`Unsupported platform: ${platform}`));
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error getting audio devices: ${error.message}`));
      }
      
      try {
        // Parse the output based on the platform
        const devices = parseDeviceOutput(stdout, platform);
        resolve(devices);
      } catch (err) {
        reject(new Error(`Failed to parse device output: ${err.message}`));
      }
    });
  });
}

function parseDeviceOutput(output, platform) {
  const devices = {
    input: [],
    output: []
  };
  
  if (platform === 'linux') {
    // Parse for both arecord (input) and aplay (output)
    const lines = output.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (!line.startsWith(' ') && !line.startsWith('null')) {
        const device = {
          id: line.trim(),
          name: line.trim(),
          isDefault: line.includes('default'),
          channels: 2
        };
        devices.input.push(device);
        devices.output.push(device);
      }
    }
    
  } else if (platform === 'win32') {
    try {
      let parsed = JSON.parse(output);
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      parsed.forEach((device, index) => {
        const deviceInfo = {
          id: device.DeviceID || `device-${index}`,
          name: device.Name,
          isDefault: index === 0,
          channels: 2
        };
        
        // Better detection of input vs output devices
        // Most audio output devices don't explicitly say "speaker" in their name
        // Assume devices are output by default unless they indicate they are input devices
        let isInput = false;
        
        const nameLC = device.Name.toLowerCase();
        const descLC = device.Description ? device.Description.toLowerCase() : '';
        const captionLC = device.Caption ? device.Caption.toLowerCase() : '';
        
        isInput = nameLC.includes('microphone') || 
                 nameLC.includes('input') || 
                 nameLC.includes('capture') ||
                 descLC.includes('microphone') ||
                 captionLC.includes('microphone');
                 
        // Add the device to the appropriate category
        if (isInput) {
          devices.input.push(deviceInfo);
        } else {
          // If not explicitly an input device, assume it's an output device
          devices.output.push(deviceInfo);
        }
      });
    } catch (err) {
      console.warn('Failed to parse Windows device output:', err);
    }
  }
  
  return devices;
}

function printDevices() {
  getAudioDevices()
    .then(devices => {
      // Print input devices
      console.log('=== Available Audio Input Devices ===');
      if (devices.input.length === 0) {
        console.log('No audio input devices found');
      } else {
        devices.input.forEach((device, index) => {
          console.log(`[${index}] ${device.name}`);
          console.log(`    Device ID: ${device.id}`);
          if (device.channels) console.log(`    Channels: ${device.channels}`);
          console.log(`    Default: ${device.isDefault ? 'Yes' : 'No'}`);
          console.log('---');
        });
        console.log(`${devices.input.length} input device(s) found\n`);
      }

      // Print output devices
      console.log('=== Available Audio Output Devices ===');
      if (devices.output.length === 0) {
        console.log('No audio output devices found');
      } else {
        devices.output.forEach((device, index) => {
          console.log(`[${index}] ${device.name}`);
          console.log(`    Device ID: ${device.id}`);
          if (device.channels) console.log(`    Channels: ${device.channels}`);
          console.log(`    Default: ${device.isDefault ? 'Yes' : 'No'}`);
          console.log('---');
        });
        console.log(`${devices.output.length} output device(s) found`);
      }
    })
    .catch(err => {
      console.error('Failed to get audio devices:', err);
    });
}

async function getDefaultDevice(type = 'output') {
  try {
    const devices = await getAudioDevices();
    // Fix to correctly handle the structure
    const deviceList = type === 'input' ? devices.input : devices.output;
    return deviceList.find(d => d.isDefault) || deviceList[0] || null;
  } catch (err) {
    console.error('Error getting default device:', err);
    return null;
  }
}

printDevices();

module.exports = {
  getAudioDevices,
  getDefaultDevice,
  printDevices
};