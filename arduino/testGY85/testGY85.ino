#include <Wire.h>
#include "GY_85.h"
 
const float alpha = 0.05;
 
double dXg = 0;
double dYg = 0;
double dZg = 0;

double roll, pitch, yaw = 0;
 
GY_85 GY85;
 
void setup()
{
    Wire.begin();
    delay(10);
    Serial.begin(2000000);
    delay(10);
    GY85.init();
    delay(10);
}

void loop()
{
    float* gyros = GY85.readGyro();
    dXg = GY85.gyro_x( gyros );
    dYg = GY85.gyro_y( gyros );
    dZg = GY85.gyro_z( gyros );

    Serial.print(dXg);
    Serial.print("\t");
    Serial.print(dYg);
    Serial.print("\t");
    Serial.print(dZg);
    Serial.print("\t||\t");
    Serial.print(pitch);
    Serial.print("\t");
    Serial.print(roll);
    Serial.print("\t");
    Serial.println(yaw);

    delay(10);
}
