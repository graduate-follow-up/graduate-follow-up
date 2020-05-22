package service.statistique.app;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.stream.Stream;

import static java.lang.System.*;
import static service.statistique.app.httpService.getAlumniResponse;

public class alumniService {

    /* Variable */
    private static final JSONParser jsonParser = new JSONParser();

    /*Method*/
    // Transform
    public static Stream getAlumniStream() throws IOException, InterruptedException, ParseException {

            Object obj = jsonParser.parse(getAlumniResponse().body());

            JSONArray alumniJsonArray = (JSONArray) obj;

        return alumniJsonArray.stream();
    }


}
