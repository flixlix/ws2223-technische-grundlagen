#define NOTE_B0 31
#define NOTE_C1 33
#define NOTE_CS1 35
#define NOTE_D1 37
#define NOTE_DS1 39
#define NOTE_E1 41
#define NOTE_F1 44
#define NOTE_FS1 46
#define NOTE_G1 49
#define NOTE_GS1 52
#define NOTE_A1 55
#define NOTE_AS1 58
#define NOTE_B1 62
#define NOTE_C2 65
#define NOTE_CS2 69
#define NOTE_D2 73
#define NOTE_DS2 78
#define NOTE_E2 82
#define NOTE_F2 87
#define NOTE_FS2 93
#define NOTE_G2 98
#define NOTE_GS2 104
#define NOTE_A2 110
#define NOTE_AS2 117
#define NOTE_B2 123
#define NOTE_C3 131
#define NOTE_CS3 139
#define NOTE_D3 147
#define NOTE_DS3 156
#define NOTE_E3 165
#define NOTE_F3 175
#define NOTE_FS3 185
#define NOTE_G3 196
#define NOTE_GS3 208
#define NOTE_A3 220
#define NOTE_AS3 233
#define NOTE_B3 247
#define NOTE_C4 262
#define NOTE_CS4 277
#define NOTE_D4 294
#define NOTE_DS4 311
#define NOTE_E4 330
#define NOTE_F4 349
#define NOTE_FS4 370
#define NOTE_G4 392
#define NOTE_GS4 415
#define NOTE_A4 440
#define NOTE_AS4 466
#define NOTE_B4 494
#define NOTE_C5 523
#define NOTE_CS5 554
#define NOTE_D5 587
#define NOTE_DS5 622
#define NOTE_E5 659
#define NOTE_F5 698
#define NOTE_FS5 740
#define NOTE_G5 784
#define NOTE_GS5 831
#define NOTE_A5 880
#define NOTE_AS5 932
#define NOTE_B5 988
#define NOTE_C6 1047
#define NOTE_CS6 1109
#define NOTE_D6 1175
#define NOTE_DS6 1245
#define NOTE_E6 1319
#define NOTE_F6 1397
#define NOTE_FS6 1480
#define NOTE_G6 1568
#define NOTE_GS6 1661
#define NOTE_A6 1760
#define NOTE_AS6 1865
#define NOTE_B6 1976
#define NOTE_C7 2093
#define NOTE_CS7 2217
#define NOTE_D7 2349
#define NOTE_DS7 2489
#define NOTE_E7 2637
#define NOTE_F7 2794
#define NOTE_FS7 2960
#define NOTE_G7 3136
#define NOTE_GS7 3322
#define NOTE_A7 3520
#define NOTE_AS7 3729
#define NOTE_B7 3951
#define NOTE_C8 4186
#define NOTE_CS8 4435
#define NOTE_D8 4699
#define NOTE_DS8 4978
#define REST 0
int tempo = 200;

int melody[] = {
  NOTE_E5,
  8,
  NOTE_E5,
  8,
  REST,
  8,
  NOTE_E5,
  8,
  REST,
  8,
  NOTE_C5,
  8,
  NOTE_E5,
  8,  //1
  NOTE_G5,
  4,
  REST,
  4,
  NOTE_G4,
  8,
  REST,
  4,

};
int notes = sizeof(melody) / sizeof(melody[0]) / 2;
// this calculates the duration of a whole note in ms
int wholenote = (60000 * 4) / tempo;

int divider = 0, noteDuration = 0;




char programState = 'r';  //'r' for read, 's' for send

/* ----------- LED RING ----------- */
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif
#define PIN 3
#define NUMPIXELS 60
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
#define DELAYVAL 1

/* ------------------------------- */

/* ---------- BUZZER ---------- */
const int buzzerPin = 6;
bool usedBuzzer = false;
/* ---------------------------- */


/* ----------- TRAFFIC LIGHT ----------- */
const int trafficLightRedPin = 5;
const int trafficLightGreenPin = 4;
/* ------------------------------------- */


/* ----------- IR REMOTE ----------- */
const int relayIRRemotePin = 2;
/* --------------------------------- */

/* ---------- TYPEWRITER INPUTS ---------- */
const int spacebarPin = 8;
bool spacebarState = false;
bool spacebarOldState = false;

const int shiftPin = 9;
bool shiftState = false;

const int returnPin = 10;
bool returnState = false;

const int keysPin = A0;
int keysState = 0;
const int tolerance = 1;    // delta value accepted to still detect key
bool keyIsPressed = false;  // variable to block multiple key presses being registered when only on keypress was made
/* --------------------------------------- */

/* ----------- KEYS MAPPING ------------ */
int resistanceValuesArray[44] = { 921, 919, 917, 914, 912, 909, 907, 904, 901, 898, 895, 891, 886, 884, 880, 876, 871, 867, 861, 852, 850, 844, 837, 831, 823, 814, 806, 796, 785 /* 5 */, 773, 760, 745, 729, 711, 690, 667, 640, 608 /* s */, 570, 526, 472, 405 /* a */, 316, 202 };
int resistanceValuesUppercaseArray[44] = { 918, 916, 914, 911 /* - */, 909 /* ß */, 907, 904, 901, 898, 895, 891, 886, 884, 880, 876, 872, 868, 863, 857, 852, 846, 840, 833 /* z */, 826, 818, 809, 800, 790, 779 /* 5 */, 767, 753, 738, 722, 703, 682, 658, 630, 598 /* s */, 560, 515, 460, 391 /* a */, 301, 185 };
// lowercase
char mappedLettersArray[44] = { '´', 'ä', 'ü', '-', 'ß', 'ö', 'p', '.', '+', 'l', 'o', ',', '9', 'k', 'i', 'm', '8', 'j', 'u', 'n', '7', 'h', 'z', 'b', '6', 'g', 't', 'v', '5', 'f', 'r', 'c', '4', 'd', 'e', 'x', '3', 's', 'w', 'y', '2', 'a', 'q', '1' };
// uppercase
char mappedUppercaseLettersArray[44] = { '`', 'Ä', 'Ü', ' ', ':', 'Ö', 'P', '!', '/', 'L', 'O', '?', '§', 'K', 'I', 'M', '_', 'J', 'U', 'N', ')', 'H', 'Z', 'B', '(', 'G', 'T', 'V', '&', 'F', 'R', 'C', '%', 'D', 'E', 'X', '=', 'S', 'W', 'Y', '23', 'A', 'Q', ';' };
/* ------------------------------------- */


#define SAMPLING_TIME 200
int bytes_counter = 20;
int total_bytes;
bool transmit_data = true;
char* text = "T";
String textToSend;
void setup() {
  Serial.begin(9600);
  setupLedRing();
  pinMode(buzzerPin, OUTPUT);
  pinMode(trafficLightRedPin, OUTPUT);
  pinMode(trafficLightGreenPin, OUTPUT);
  pinMode(relayIRRemotePin, OUTPUT);
  pinMode(spacebarPin, INPUT_PULLUP);
  pinMode(shiftPin, INPUT_PULLUP);
  pinMode(returnPin, INPUT_PULLUP);
  pinMode(keysPin, INPUT);
  total_bytes = textToSend.length();
}

void setupLedRing() {
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  pixels.begin();
}

void loop() {
  switch (programState) {
    case 'r':
      usedBuzzer = false;
      changeTrafficLight("green");
      runReadLoop();
      break;
    case 'w': /* wait to send signal */
      loopWait();
      break;
    case 's':
      /* run once */
      bool ranSendFunc = false;
      if (!ranSendFunc) {
        runSendLoop();
        ranSendFunc = true;
      }
      programState = 'r';
      break;
  }
  /*   Serial.println(analogRead(keysPin));
  changeTrafficLight("green");
  digitalWrite(relayIRRemotePin, HIGH);
  writeLeds("on");
  delay(5000);
  changeTrafficLight("red");
  digitalWrite(relayIRRemotePin, LOW);
  writeLeds("off");
  delay(5000); */
  /* bytes_counter = total_bytes;
  while (transmit_data) {
    byte currentByte = text[total_bytes - bytes_counter];
    Serial.print("current byte: ");
    Serial.print(currentByte);
    Serial.println(text[total_bytes - bytes_counter]);
    transmit_byte(text[total_bytes - bytes_counter]);
    bytes_counter--;
    if (bytes_counter == 0) {
      transmit_data = false;
    }
  }
  transmit_data = true; */
}

void loopWait() {
  changeTrafficLight("red");
  if (!usedBuzzer) {
    activateBuzzer();
  }
  if (Serial.available()) {
    textToSend = Serial.readString();
    if (textToSend == "cancel4321") {
      programState = 'r';
      Serial.println("cancel4321");
    } else {
      programState = 's';
    }
  }
}

void activateBuzzer() {
  for (int thisNote = 0; thisNote < notes * 2; thisNote = thisNote + 2) {

    // calculates the duration of each note
    divider = melody[thisNote + 1];
    if (divider > 0) {
      // regular note, just proceed
      noteDuration = (wholenote) / divider;
    } else if (divider < 0) {
      // dotted notes are represented with negative durations!!
      noteDuration = (wholenote) / abs(divider);
      noteDuration *= 1.5;  // increases the duration in half for dotted notes
    }

    // we only play the note for 90% of the duration, leaving 10% as a pause
    tone(buzzerPin, melody[thisNote], noteDuration * 0.9);

    // Wait for the specief duration before playing the next note.
    delay(noteDuration);

    // stop the waveform generation before the next note.
    noTone(buzzerPin);
  }
  usedBuzzer = true;
}

void runReadLoop() {
  updateValueReadings();
  detectReturnPress();
  detectSpacebarPress();
  detectKeyPress();
}

void updateValueReadings() {
  spacebarOldState = spacebarState;
  keysState = analogRead(keysPin);
  shiftState = digitalRead(shiftPin);
  spacebarState = digitalRead(spacebarPin);
  returnState = !digitalRead(returnPin);
  /* debugInputs(); */
}

void debugInputs() {
  Serial.print("keys: ");
  Serial.print(keysState);
  Serial.print("; shift: ");
  Serial.print(shiftState);
  Serial.print("; spacebar: ");
  Serial.print(spacebarState);
  Serial.print("; return: ");
  Serial.print(returnState);
  Serial.println("");
}

void detectReturnPress() {
  if (returnState) {
    Serial.println("");
    Serial.println("");
    programState = 'w';
  }
}

void detectKeyPress() {
  if (shiftState) {
    for (int i = 0; i < sizeof resistanceValuesUppercaseArray / sizeof resistanceValuesUppercaseArray[0]; i++) {
      if (keysState > resistanceValuesUppercaseArray[i] - tolerance && keysState < resistanceValuesUppercaseArray[i] + tolerance && !keyIsPressed) {
        Serial.print(mappedUppercaseLettersArray[i]);
        while (keysState < 1023) {
          keysState = analogRead(keysPin);
          keyIsPressed = true;
        }
        keyIsPressed = false;
        delay(100);
        return;
      }
    }
  } else {
    for (int i = 0; i < sizeof resistanceValuesArray / sizeof resistanceValuesArray[0]; i++) {

      if (keysState > resistanceValuesArray[i] - tolerance && keysState < resistanceValuesArray[i] + tolerance && !keyIsPressed) {
        Serial.print(mappedLettersArray[i]);
        while (keysState < 1023) {
          keysState = analogRead(keysPin);
          keyIsPressed = true;
        }
        keyIsPressed = false;
        delay(100);
        return;
      }
    }
  }
}

void detectSpacebarPress() {
  if (spacebarState && spacebarState != spacebarOldState) {
    Serial.print(" ");
    while (spacebarState) {
      updateValueReadings();
    }
    delay(100);
  }
}

void changeTrafficLight(String option) {
  if (option == "green") {
    digitalWrite(trafficLightRedPin, LOW);
    digitalWrite(trafficLightGreenPin, HIGH);
  } else {
    digitalWrite(trafficLightRedPin, HIGH);
    digitalWrite(trafficLightGreenPin, LOW);
  }
}

void writeLeds(String state) {
  if (state == "on") {
    for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...
      pixels.setPixelColor(i, pixels.Color(128, 128, 128));
      pixels.show();
      /* delay(DELAYVAL); */
    }
  } else if (state == "off") {
    for (int i = NUMPIXELS - 1; i >= 0; i--) {
      pixels.setPixelColor(i, pixels.Color(0, 0, 0));
      pixels.show();
      /* delay(DELAYVAL); */
    }
  }
}

void runSendLoop() {
  total_bytes = textToSend.length();
  bytes_counter = total_bytes;
  while (transmit_data) {
    digitalWrite(relayIRRemotePin, LOW);
    byte currentByte = textToSend[total_bytes - bytes_counter];
    /* Serial.print(currentByte); */
    /* Serial.print("current byte: ");
    Serial.print(currentByte);
    Serial.println(text[total_bytes - bytes_counter]); */
    transmit_byte(textToSend[total_bytes - bytes_counter]);

    bytes_counter--;
    if (bytes_counter == 0) {
      transmit_data = false;
    }
  }
  /* programState = 'r'; */
  transmit_data = true;
  Serial.println("sendBackground4321");
}

void transmit_byte(char data_byte) {
  digitalWrite(relayIRRemotePin, HIGH);
  writeLeds(true);

  delay((SAMPLING_TIME * 3) - 123);
  for (int i = 0; i < 8; i++) {
    unsigned long startMillis = millis();
    bool currentBit = (data_byte >> i) & 0x01;
    /* Serial.print(currentBit); */
    digitalWrite(relayIRRemotePin, currentBit);
    writeLeds(currentBit);
    delay(SAMPLING_TIME - 123);
    /* Serial.print(" took: ");
    Serial.println(millis() - startMillis); */
  }
  digitalWrite(relayIRRemotePin, LOW);  //Return to IDLE state
  writeLeds(false);
  delay(SAMPLING_TIME - 123);
}

void writeLeds(bool state) {
  if (state == true) {
    for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...
      pixels.setPixelColor(i, pixels.Color(100, 100, 100));

      pixels.show();

      delay(DELAYVAL);
    }
  } else if (state == false) {
    for (int i = NUMPIXELS - 1; i >= 0; i--) {  // For each pixel...
      pixels.setPixelColor(i, pixels.Color(0, 0, 0));
      pixels.show();
      delay(DELAYVAL);
    }
  }
}