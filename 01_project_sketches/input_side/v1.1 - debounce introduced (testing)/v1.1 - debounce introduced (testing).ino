/*                                                                           */
/*                                                                           */
/* Schreibmsaschinenkommunikation                                            */
/*                                                                           */
/* The main idea of this project is to make two independent typwriters       */
/* interact with eachother with light in between                             */
/*                                                                           */
/*                                                                           */
/* A project of: Luca Félix & Tim Niedermeier                                */
/* Professor: Michael Schuster                                               */
/* Hochschule für Gestaltung - Schwäbisch Gmünd                              */
/*                                                                           */
/*                                                                           */


/* keys input */
int keyPin = A0;               // input pin for the key detection
int keyValue = 0;              // variable to store the value coming from the sensor
bool keyIsPressed = false;     // variable to block multiple key presses being registered when only on keypress was made
const int tolerance = 2;       // delta value accepted to still detect key
char letterDetected;           // char of letter mapped from value of the sensor
long keylastDebounceTime = 0;  // the last time the output pin was toggled
long keyDebounceDelay = 1;  // the debounce time; increase if the output flickers
int lastReading;

/* array to store readings from each key */
int resistanceValuesArray[44] = { 165, 285, 374, 444, 500, 546, 597, 629, 657, 682, 704, 722, 739, 754, 768, 780, 792, 802, 811, 820, 828, 836, 843, 849, 856, 861, 867, 872, 877, 881, 886, 890, 895, 899, 903, 907, 911, 916, 921, 927, 934, 944, 961, 1009 };
int keyToleranceValues[44] = { 30, 20, 20, 20, 15, 10, 10, 10, 10, 10, 7, 7, 7, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 };
/* arrays to map input values to letters in typewriter */

// lowercase
char mappedLettersArray[44] = { '´', 'ä', 'ü', '-', 'ß', 'ö', 'p', '.', '+', 'l', 'o', ',', '9', 'k', 'i', 'm', '8', 'j', 'u', 'n', '7', 'h', 'z', 'b', '6', 'g', 't', 'v', '5', 'f', 'r', 'c', '4', 'd', 'e', 'x', '3', 's', 'w', 'y', '2', 'a', 'q', '1' };
// uppercase
char mappedUppercaseLettersArray[44] = { '`', 'Ä', 'Ü', ' ', ':', 'Ö', 'P', '!', '/', 'L', 'O', '?', '§', 'K', 'I', 'M', '_', 'J', 'U', 'N', ')', 'H', 'Z', 'B', '(', 'G', 'T', 'V', '&', 'F', 'R', 'C', '%', 'D', 'E', 'X', '=', 'S', 'W', 'Y', '23', 'A', 'Q', ';' };

/* shift input */
int shiftPin = 2;         // input pin for shift detection
bool shiftValue = false;  // variable to store the incoming value from the sensor

/* return input (new line arm) */
int returnPin = 4;
bool returnValue = false;
bool returnIsPressed = false;

/* spacebar input */
int spacebarPin = 3;
bool spacebarValue = false;
bool spacebarIsPressed = false;
int desiredValue = 1014;

int ledPin = 13;  // select the pin for the LED

void setup() {

  /* prepare all pins for input or output */
  pinMode(ledPin, OUTPUT);
  pinMode(shiftPin, INPUT);
  pinMode(spacebarPin, INPUT);
  pinMode(returnPin, INPUT);

  /* iniciate serial communication */
  Serial.begin(9600);
}

void loop() {
  updateValueReadings();
  detectReturnPress();
  detectSpacebarPress();
  detectKeyPress();
  /* Serial.println(keyValue); */
}

void updateValueReadings() {
  keyValue = analogRead(keyPin);
  shiftValue = digitalRead(shiftPin);
  spacebarValue = digitalRead(spacebarPin);
  returnValue = !digitalRead(returnPin);
}

void detectReturnPress() {
  if (returnValue && !returnIsPressed) {
    Serial.println(" ");
    while (returnValue) {
      returnValue = digitalRead(returnPin);
      returnIsPressed = true;
    }
    returnIsPressed = false;
    delay(1000);
  }
}

void detectSpacebarPress() {
  if (spacebarValue && !spacebarIsPressed) {
    Serial.print(" ");
    while (spacebarValue) {
      spacebarValue = digitalRead(spacebarPin);
      spacebarIsPressed = true;
    }
    spacebarIsPressed = false;
    delay(100);
  }
}

void detectKeyPress() {
  mapKeyPress();
  /* Serial.println(letterDetected); */
  if (Debounce(letterDetected) && letterDetected != '0') {
    Serial.print(letterDetected);

    while(keyValue < 1010) {
      updateValueReadings();
      // wait for key to be released again
    }
    delay(50); // stop after releasing key for 50ms to avoid double clicks
  }
}

char mapKeyPress() {
  bool isLetterDetected = false;
  for (int i = 0; i < sizeof resistanceValuesArray / sizeof resistanceValuesArray[0]; i++) {
    if (keyValue > resistanceValuesArray[i] - keyToleranceValues[i] && keyValue < resistanceValuesArray[i] + keyToleranceValues[i] && !keyIsPressed) {
      isLetterDetected = true;
      if (shiftValue) {
        letterDetected = mappedUppercaseLettersArray[i];
      } else {
        letterDetected = mappedLettersArray[i];
      }
    }
  }
  if (!isLetterDetected) {
    letterDetected = '0';
  }
  return letterDetected;
}

bool Debounce(char reading) {
  if (reading != lastReading) {
    keylastDebounceTime = millis();
  }
  long timePassed = (millis() - keylastDebounceTime);
  if (timePassed > keyDebounceDelay) {
    return (HIGH);
  } else {
    lastReading = reading;
    return (LOW);
  }
}