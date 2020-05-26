package service.statistique.app;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static service.statistique.app.AlumniService.getAlumniStream;
import static service.statistique.app.JsonService.Jsonify;

public class ChartTypeService {


    public static String chartTypeGenerator(String nbName, String fieldName) throws InterruptedException, ParseException, IOException {

        List<String> fields = getFieldList(fieldName);

        return fields.stream()
                .map(f -> {
                    Double avg = null;
                    try {
                        avg = calculateAvgOfField(f,fieldName, nbName); // Calculate average of the field
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (ParseException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return "{" + Jsonify(fieldName,f) + "," + Jsonify(nbName, String.valueOf(avg))  + "}";
                }).collect(Collectors.joining(", "));
    }


    private static Double calculateAvgOfField(String f, String fieldName, String nbName) throws InterruptedException, ParseException, IOException {
        return getAlumniStream()
                .mapToDouble(x -> (Long) x.get(nbName))
                .average()
                .getAsDouble();
    }


    private static List<String> getFieldList(String fieldName) throws InterruptedException, ParseException, IOException {
        return getAlumniStream()
                .map(e -> (String) e.get(fieldName))
                .distinct()
                .collect(Collectors.toList());
    }
}
