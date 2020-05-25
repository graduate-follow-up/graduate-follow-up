package service.statistique.app;

import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.stream.Collectors;

import static service.statistique.app.AlumniService.getAlumniStream;
import static service.statistique.app.JsonService.Jsonify;

@RestController
public class Controller {


    @GetMapping("/")
    Double test () throws IOException, InterruptedException, ParseException {

        return getAlumniStream()
                .map(al -> al.get("wage"))
                .collect(Collectors.averagingInt(x -> Integer.parseInt(x.toString())));
    }

    // Get 2 values in array [(number,string),...]
    @GetMapping("/chartType/{nbName}/{strName}")
    String chartType (@PathVariable String nbName, @PathVariable String strName) throws IOException, InterruptedException, ParseException {

        return JsonService.Jsonify(getAlumniStream()
                .map(al -> "{" + nbName + ":" + al.get("wage") + ""));
    }
}
