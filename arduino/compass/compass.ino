#include "GY_85.h"
#include <Wire.h>

GY_85 GY85;     //create the object

int cx, cy, cz;

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
    
    int cx = GY85.compass_x( GY85.readFromCompass() );
    int cy = GY85.compass_y( GY85.readFromCompass() );
    int cz = GY85.compass_z( GY85.readFromCompass() );
    
    Serial.print  ( "  compass" );
    Serial.print  ( " x:\t" );
    Serial.print  ( cx );
    Serial.print  ( "\ty:\t" );
    Serial.print  ( cy );
    Serial.print  ( "\tz:\t" );
    Serial.println  ( cz );
    
}
