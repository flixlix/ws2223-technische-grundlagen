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
const int tolerance = 4;       // delta value accepted to still detect key
char letterDetected;           // char of letter mapped from value of the sensor
long keylastDebounceTime = 0;  // the last time the output pin was toggled
long keyDebounceDelay = 5;  // the debounce time; increase if the output flickers
int lastReading;

/* array to store readings from each key */
int resistanceValuesArray[44] = { 91, 167, 231, 287, 335, 378, 416, 449, 479, 506, 530, 553, 573, 592, 609, 625, 639, 653, 666, 678, 689, 699, 709, 718, 727, 735, 743, 750, 757, 763, 769, 776, 782, 787, 793, 798, 803, 807, 811, 815, 818, 824, 827, 831 };
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

    while(keyValue < 1023) {
      updateValueReadings();
      // wait for key to be released again
    }
    delay(50); // stop after releasing key for 50ms to avoid double clicks
  }
}

char mapKeyPress() {
  bool isLetterDetected = false;
  for (int i = 0; i < sizeof resistanceValuesArray / sizeof resistanceValuesArray[0]; i++) {
    if (keyValue > resistanceValuesArray[i] - tolerance && keyValue < resistanceValuesArray[i] + tolerance && !keyIsPressed) {
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