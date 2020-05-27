package service.statistique.app;

import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.stream.Collectors;

import static service.statistique.app.AlumniService.getAlumniStream;
import static service.statistique.app.ChartTypeService.chartTypeGenerator;

@RestController
public class Controller {
    // Get 2 values in array [(number,string),...]
    @GetMapping("/chartType/{nbName}/{strName}")
    String chartType (@PathVariable String nbName, @PathVariable String strName, @RequestHeader(value="Authorization", required=false) String authorization) throws IOException, InterruptedException, ParseException {
        if(authorization != null && authorization.startsWith("Bearer ") && JwtTokenUtil.isValidToken(authorization.split(" ")[1])) {
            return "[" + chartTypeGenerator(nbName, strName) + "]";
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
