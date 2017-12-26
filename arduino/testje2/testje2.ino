#include <Wire.h>
#include "ADXL345.h"
#include "GY_85.h"
 
const float alpha = 0.05;
 
double fXg = 0;
double fYg = 0;
double fZg = 0;

double yaw = 0;

double lengthOfVector = 0;
 
ADXL345 acc;
GY_85 GY85;
 
void setup()
{
    acc.begin();
    acc.setRange(acc.RANGE_16G);
    //acc.setZeroG(-2.18, -2.25, +4.93);
    acc.setZeroG(-1.02, -0.98, 6.00);
    Serial.begin(2000000);
    delay(100);
}

void loop()
{
    double pitch, roll, Xg, Yg, Zg, gyroD;
    acc.read(&Xg, &Yg, &Zg);

    //Low Pass Filter
    fXg = Xg * alpha + (fXg * (1.0 - alpha));
    fYg = Yg * alpha + (fYg * (1.0 - alpha));
    fZg = Zg * alpha + (fZg * (1.0 - alpha));
    gyroD = GY85.gyro_z( GY85.readGyro() );

    lengthOfVector = sqrt( sq(fXg) + sq(fYg) + sq(fZg) );

    pitch = asin( fYg / lengthOfVector );
    if (pitch != 0) {
      roll = asin( fXg / (cos(pitch)*lengthOfVector) ); //Beware cos(pitch)==0, catch this exception!
    } else {
      roll = 0;
    }
    yaw = 0;

    //Roll & Pitch Equations
    roll  = atan2(-fYg, fZg);
    pitch = atan2(fXg, sqrt(fYg*fYg + fZg*fZg));

    Serial.print(gyroD);
    Serial.print("\t");
    Serial.print(fXg);
    Serial.print("\t");
    Serial.print(fYg);
    Serial.print("\t");
    Serial.print(fZg);
    Serial.print("\t||\t");
    Serial.print(pitch);
    Serial.print("\t");
    Serial.println(roll);

    delay(10);
}
