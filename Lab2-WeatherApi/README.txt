
Chelsea Carlson
carlsc3
README

I had a really hard time, my location function didn't want to work on any browser.
I tried Chrome first, then Mozilla, then IE. Whew, none wanted to work or if they ran
they ran and errored out.

So, my work around was setting up ajax calls to pre-recieved json files and formatting
the page around this. This started as a temp way for me to set up the page without
querying the API a billion times but stuck in once I realized nothing wanted to work.

So, if for some reason the calls to geolocation don't fail on your computer it should
render the page with up to date info, but who really knows.

I used WeatherUnderground API because its a really smooth API thats simple to call
and features several different ways to query a certain city ( I was considering writing
in the code to use the IP address because I know that that is available to the browser 
but I decided that may not be accurate enough). They offer a small free plan and thats
all I needed.