package service.statistique.app;

import java.util.stream.Stream;

public class JsonService {





    public static String Jsonify(String name, String value) {
        return "\"" + name + "\":\"" + value + "\"";
    }

    public static String JsonifyValueNot(String name, String value) {
        return "\"" + name + "\":" + value + "";
    }
}
