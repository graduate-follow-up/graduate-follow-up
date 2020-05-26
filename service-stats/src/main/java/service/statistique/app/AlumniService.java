package service.statistique.app;

import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.stream.Stream;

import static service.statistique.app.HttpService.getAlumniResponse;

public class AlumniService {

    /* Variable */
    private static final JSONParser jsonParser = new JSONParser();

    /*Method*/
    // Transform response to stream
    public static Stream<JSONObject> getAlumniStream() throws IOException, InterruptedException, ParseException {

            JSONArray alumniJsonArray = (JSONArray) jsonParser.parse(getAlumniResponse().body());

            //JSONArray alumniJsonArray = (JSONArray) obj;

        return alumniJsonArray.stream();
    }

   /* StringBuffer sb = new StringBuffer();
        sb.append(f);
    String str6 = sb.toString();*/
}
