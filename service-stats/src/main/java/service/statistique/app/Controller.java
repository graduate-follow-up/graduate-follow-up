package service.statistique.app;

import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.stream.Collectors;

import static service.statistique.app.alumniService.getAlumniStream;

@RestController
public class Controller {


    @GetMapping("/")
    Double test () throws IOException, InterruptedException, ParseException {

        return getAlumniStream()
                .map(al -> al.get("wage"))
                .collect(Collectors.averagingInt(x -> Integer.parseInt(x.toString())));
    }
}
