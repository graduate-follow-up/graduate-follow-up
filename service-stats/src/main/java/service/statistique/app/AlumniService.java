package service.statistique.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.HttpResponse;
import java.rmi.ServerException;
import java.util.stream.Stream;

import static service.statistique.app.HttpService.getAlumniResponse;

public class AlumniService {

    /* Variable */
    private static final JSONParser jsonParser = new JSONParser();

    /*Method*/
    // Transform response to stream
    public static Stream<JSONObject> getAlumniStream() throws IOException, InterruptedException, ParseException, URISyntaxException {

        HttpResponse<String> response = getAlumniResponse();

        if(response.statusCode() != 200) {
            throw new ServerException("Request failed");
        }

        JSONArray alumniArray = (JSONArray) jsonParser.parse(response.body());
        return alumniArray.stream();
    }

   /* StringBuffer sb = new StringBuffer();
        sb.append(f);
    String str6 = sb.toString();*/
}
