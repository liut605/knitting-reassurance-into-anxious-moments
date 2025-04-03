let serial;
let latestData = "waiting for data";
let currentData;
let dataArray = [];
function setup() {
  createCanvas(windowWidth, windowHeight);

  serial = new p5.SerialPort();
  serial.list();
  serial.open("/dev/tty.usbserial-0001", { baudRate: 115200 });
  serial.on("connected", serverConnected);
  serial.on("list", gotList);
  serial.on("data", gotData);
  serial.on("error", gotError);
  serial.on("open", gotOpen);
  serial.on("close", gotClose);
}

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

// function gotData() {
//   let currentString = serial.readBytesUntil();
//   //if (!currentString || currentString.trim().length === 0) return;

//   console.log("Raw Data Received:", currentString); // Debug log

//   // let rowValues = currentString[0].split(",");
//   // console.log("Parsed Values:", rowValues);

//   // Use the data
//   // if (rowValues.length === 2) {
//   //   let sensor1 = rowValues[0];
//   //   let sensor2 = rowValues[1];
//   //   console.log(`Sensor1: ${sensor1}, Sensor2: ${sensor2}`);
//   // }
// }
function gotData() {
  let incomingBytes = serial.readBytes(); // Read 48 bytes (24 values * 2 bytes)

  // 2 bytes * 24 values
  pressureValues = [];
  for (let i = 0; i < incomingBytes.length; i += 2) {
    let highByte = incomingBytes[i];
    let lowByte = incomingBytes[i + 1];
    let pressure = (highByte << 8) | lowByte; // Combine the two bytes into an integer
    pressureValues.push(pressure);
  }
  console.log("Parsed Pressure Values:", pressureValues);
}
// Polling method
/*
 if (serial.available() > 0) {
  let data = serial.read();
  ellipse(50,50,data,data);
 }
 */
// }

function draw() {
  background(230, 228, 222);

  if (dataArray.length === 4) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        let pressureValue = dataArray[r][c];
        let circleSize = map(pressureValue, 0, 1023, 0, 150);

        fill(0);
        circle(c * 220 + 280, r * 220 + 130, circleSize);
      }
    }
  }
}
