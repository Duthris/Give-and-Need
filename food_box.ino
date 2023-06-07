#include <WiFi.h>
#include <HTTPClient.h>
#include <Keypad.h>

const char* ssid = "ANIL_2.4G";
const char* password = "1123581321";

const char* serverUrl = "http://192.168.1.5:4000"; // Replace with your server URL

const int ROW_NUM    = 4; // Four rows
const int COLUMN_NUM = 3; // Three columns
char keys[ROW_NUM][COLUMN_NUM] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};
byte pin_rows[ROW_NUM] = { 21, 19, 5, 18 };    // connect to the row pinouts of the keypad
byte pin_column[COLUMN_NUM] = { 12, 13, 14 };  // connect to the column pinouts of the keypad

Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM);

const int redLedPin = 25;
const int greenLedPin = 2;
const int yellowLedPin = 32;

void setup() {
  Serial.begin(115200);

  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(yellowLedPin, OUTPUT);

  connectToWiFi();
}

void loop() {
  static bool isWaitingForKey = false;
  static bool numberEntered = false;

  char key = keypad.getKey();
  
  if (key) {
    if (!isWaitingForKey) {
      if (key == '#') {
        String number = readKeypadInput();
        sendNumber(number);
        numberEntered = true;
      } else if (key == '*') {
        resetLights();
        numberEntered = false;
      }
    }
  }

  if (!numberEntered) {
    if (!isWaitingForKey) {
      digitalWrite(yellowLedPin, HIGH);
      isWaitingForKey = true;
    }
    if (keypad.getState() == IDLE && isWaitingForKey) {
      digitalWrite(yellowLedPin, LOW);
      isWaitingForKey = false;
    }
  }
}

String readKeypadInput() {
  String number = "";
  char key;
  
  while (number.length() < 6) {
    key = keypad.getKey();
    
    if (key) {
      if (key == '#') {
        break;
      } else if (key == '*') {
        number = "";
        resetLights();
      } else {
        number += key;
      }
    }
    
    delay(100);
  }
  
  return number;
}

void sendNumber(const String& number) {
  WiFiClient client;
  HTTPClient http;
  
  String url = String(serverUrl) + "/needers/check-food-box-password"; // Replace with your endpoint for number checking
  
  http.begin(client, url);
  http.addHeader("Content-Type", "text/plain");	
  http.addHeader("password", number);	

  String payload = "password=" + number;	
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    
    if (response == "true") {
      digitalWrite(redLedPin, LOW);
      digitalWrite(greenLedPin, HIGH);
    } else {
      digitalWrite(redLedPin, HIGH);
      digitalWrite(greenLedPin, LOW);
    }
  }
  
  http.end();
}

void resetLights() {
  digitalWrite(redLedPin, LOW);
  digitalWrite(greenLedPin, LOW);
  digitalWrite(yellowLedPin, HIGH);
}

void connectToWiFi() {
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}