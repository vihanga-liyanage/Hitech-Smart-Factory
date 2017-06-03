package hello;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Created by vihanga on 4/29/17.
 */
public class HelloWorld {


    public static String getMessage() {
        System.out.println("getMessage");
        return "Test message";
    }

    public static String getData() {
        System.out.println("getData");
        String out = "Error ";
        try {

            URI uri = HelloWorld.class.getClassLoader().getResource("metadata/data.txt").toURI();
            out = String.valueOf(Files.readAllLines(Paths.get(uri)));

        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return out;

    }
}