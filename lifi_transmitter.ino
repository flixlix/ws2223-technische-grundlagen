#define LED_PIN 9
#define BUTTON_PIN 2
#define BUTTON_PIN_3 3
#define BUTTON_PIN_4 4
#define PERIOD 100

char *string = "LN\n";
int string_length;
bool buttonState = false;
bool buttonState3 = false;
bool buttonState4 = false;

void setup()
{
    Serial.begin(9600);

    pinMode(LED_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT);
    pinMode(BUTTON_PIN_3, INPUT);
    pinMode(BUTTON_PIN_4, INPUT);
    string_length = strlen(string);
    digitalWrite(LED_PIN, HIGH);
    delay(PERIOD);
}

void loop()
{
    buttonState = digitalRead(BUTTON_PIN);
    buttonState3 = digitalRead(BUTTON_PIN_3);
    buttonState4 = digitalRead(BUTTON_PIN_4);
    if (buttonState)
    {
        send_byte(string[0]);
        delay(1000);
    }
    if (buttonState3)
    {
        send_byte(string[1]);
        delay(1000);
    }
    if (buttonState4)
    {
        send_byte(string[2]);
        delay(1000);
    }
}

void send_byte(char my_byte)
{
    digitalWrite(LED_PIN, LOW);
    delay(PERIOD);

    // transmission of bits
    for (int i = 0; i < 8; i++)
    {
        digitalWrite(LED_PIN, (my_byte & (0x01 << i)) != 0);
        delay(PERIOD);
    }

    digitalWrite(LED_PIN, HIGH);
    delay(PERIOD);
}