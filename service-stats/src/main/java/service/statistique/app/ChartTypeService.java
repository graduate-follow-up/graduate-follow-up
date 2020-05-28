package service.statistique.app;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static service.statistique.app.AlumniService.getAlumniStream;
import static service.statistique.app.JsonService.*;

public class ChartTypeService {


    public static String chartTypeGenerator(String nbName, String fieldName) throws InterruptedException, ParseException, IOException, URISyntaxException {

        List<String> fields = getFieldList(fieldName);

        return fields.stream()
                .map(f -> {
                    Double avg = null;
                    try {
                        avg = calculateAvgOfField(f,fieldName, nbName); // Calculate average of the field
                    } catch (InterruptedException | ParseException | IOException | URISyntaxException e) {
                        e.printStackTrace();
                    }
                    return "{" + Jsonify("label",f) + "," + JsonifyValueNot("y", String.valueOf(avg))  + "}";
                }).collect(Collectors.joining(", "));
    }


    private static Double calculateAvgOfField(String f, String fieldName, String nbName) throws InterruptedException, ParseException, IOException, URISyntaxException {
        return getAlumniStream()
                .filter(e -> e.get(fieldName).equals(f))
                .mapToDouble(x -> (Long) x.get(nbName))
                .average()
                .getAsDouble();
    }


    private static List<String> getFieldList(String fieldName) throws InterruptedException, ParseException, IOException, URISyntaxException {
        return getAlumniStream()
                .map(e -> (String) e.get(fieldName))
                .distinct()
                .collect(Collectors.toList());
    }
}
