package service.statistique.app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static service.statistique.app.alumniService.getAlumni;

@RestController
public class Controller {


    @GetMapping("/")
    String test () throws IOException, InterruptedException {

        System.out.println(getAlumni());
        System.out.println();

        return getAlumni().toString();
    }
}
