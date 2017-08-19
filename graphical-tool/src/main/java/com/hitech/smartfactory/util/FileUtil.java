package com.hitech.smartfactory.util;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.Base64;
import java.util.Properties;

/**
 * Created by Vihanga Liyanage on 8/5/2017.
 */
public class FileUtil {
    private String FILE_SERVER_BASE;
    private String APPLICATION_BASE;
    private String IMAGE_BASE = "images/hitech/";

    public FileUtil() {
        Properties prop = new Properties();
        InputStream inputStream = DbUtil.class.getClassLoader().getResourceAsStream("system.properties");
        try {
            prop.load(inputStream);
            FILE_SERVER_BASE = prop.getProperty("file-server-base");
            APPLICATION_BASE = prop.getProperty("app-base-path");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Writes a file to a predefined location. Extension must be provided with the name
    public boolean saveFile(String name, String content) {
        name = name.replaceAll(" ", "-");
        File file = new File(FILE_SERVER_BASE + name);
        file.getParentFile().mkdirs();
        try {
            FileWriter writer = new FileWriter(file);
            writer.write(content);
            writer.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Add new toolbox item by updating diagrameditor.xml file
    public boolean addToolboxItem(String model, String category, String toolboxPreview, String canvasPreview){
        String filePath = APPLICATION_BASE + "config/diagrameditor.xml";

        // Convert category: 'Production Line Items' -> 'production-line-items'
        String categoryFilePath = "".join("-", category.toLowerCase().split(" "));
        // Convert model: 'Abc Xyz' -> 'Abc-Xyz'
        model = "".join("-", model.split(" "));
        // Remove 'data:image/png;base64' part in image strings
        toolboxPreview = toolboxPreview.split(",")[1];
        canvasPreview = canvasPreview.split(",")[1];

        try {
            // Open file and get document element
            File fXmlFile = new File(filePath);
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(fXmlFile);
            doc.getDocumentElement().normalize();

            // Save images
            String toolboxImagePath = IMAGE_BASE + categoryFilePath + "/" + model + ".jpg";
            String canvasImagePath = IMAGE_BASE + categoryFilePath + "/" + model + ".png";
            try {
                // save tool box icon
                FileOutputStream toolboxImageFile = new FileOutputStream(APPLICATION_BASE + toolboxImagePath);
                byte[] toolboxImageByteArray = Base64.getDecoder().decode(toolboxPreview);
                toolboxImageFile.write(toolboxImageByteArray);
                toolboxImageFile.close();

                // save canvas icon
                FileOutputStream canvasImageFile = new FileOutputStream(APPLICATION_BASE + canvasImagePath);
                byte[] canvasImageByteArray = Base64.getDecoder().decode(canvasPreview);
                canvasImageFile.write(canvasImageByteArray);
                canvasImageFile.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }

            // Inserting new content into array node and set it to doc
            doc = setModifiedArrayNode(doc, model, categoryFilePath);

            // Inserting new content into mxStylesheet node and set it to doc
            doc = setModifiedMxStylesheetNode(doc, model, categoryFilePath, canvasImagePath);

            // Inserting new content into mxStylesheet node and set it to doc
            doc = setMxDefaultToolbarNode(doc, model, categoryFilePath, toolboxImagePath);

            // Final formatting
            String out = nodeToString(doc).replace(categoryFilePath+"-->", categoryFilePath+"-->\n\t\t");
            out = out.replace("/><add", "/>\n\t\t<add");
            // Write to file
            FileOutputStream diagramEditorXml = new FileOutputStream(filePath);
            diagramEditorXml.write(out.getBytes());
            diagramEditorXml.close();
            return true;

        } catch (SAXException | IOException | ParserConfigurationException e) {
            e.printStackTrace();
        }

        return false;
    }

    private Document setModifiedArrayNode(Document doc, String model, String categoryFilePath) {
        Node arrayNode = doc.getElementsByTagName("Array").item(0);

        boolean entryPointFound = false;
        // clone array node without children
        Node newArrayNode = arrayNode.cloneNode(false);
        // Loop through children of array node
        for (int i=0; i<arrayNode.getChildNodes().getLength(); i++) {
            Node y = arrayNode.getChildNodes().item(i);
            // Find entry point depending on the comments
            if (y.getNodeType() == Node.COMMENT_NODE && ((Comment)y).getData().equals(categoryFilePath)) {
                entryPointFound = true;
                // append comment node as well
                newArrayNode.appendChild(y);
                continue;
            }
            // Append modified add node to newArray node
            if (entryPointFound && y.getNodeType() == Node.ELEMENT_NODE) {
                Node newNode = y.cloneNode(true);
                // set <add as="ConveyorBelt">
                ((Element)newNode).setAttribute("as", model);
                Node mxCell = newNode.getChildNodes().item(1).getChildNodes().item(1);
                // set <mxCell vertex="1" style="conveyor-belt">
                ((Element)mxCell).setAttribute("style", model);

                newArrayNode.appendChild(newNode);
                entryPointFound = false;
            }
            // Add nodes to newArrayNode
            newArrayNode.appendChild(y.cloneNode(true));
        }
        // Replace modified array node in doc
        doc.getDocumentElement().replaceChild(newArrayNode, arrayNode);

        return doc;
    }

    private Document setModifiedMxStylesheetNode(Document doc, String model, String categoryFilePath, String canvasImagePath) {
        Node mxStylesheetNode = doc.getElementsByTagName("mxStylesheet").item(0);

        boolean entryPointFound = false;
        // clone mxStylesheet node without children
        Node newMxStylesheetNode = mxStylesheetNode.cloneNode(false);
        // Loop through children of mxStylesheet node
        for (int i=0; i<mxStylesheetNode.getChildNodes().getLength(); i++) {
            Node y = mxStylesheetNode.getChildNodes().item(i);
            // Find entry point depending on the comments
            if (y.getNodeType() == Node.COMMENT_NODE && ((Comment)y).getData().equals(categoryFilePath)) {
                entryPointFound = true;
                // append comment node as well
                newMxStylesheetNode.appendChild(y);
                continue;
            }
            // Append modified add node to newMxStylesheet node
            if (entryPointFound && y.getNodeType() == Node.ELEMENT_NODE) {
                Node newNode = y.cloneNode(true);
                // set <add as="conveyor-belt">
                ((Element)newNode).setAttribute("as", model);
                // set <add as="image" value="images/hitech/production-line-items/conveyor-belt.png"/>
                Node imageNode = newNode.getChildNodes().item(5);
                ((Element)imageNode).setAttribute("value", canvasImagePath);

                newMxStylesheetNode.appendChild(newNode);
                entryPointFound = false;
            }
            // Add other add nodes to new mxStylesheet node
            newMxStylesheetNode.appendChild(y.cloneNode(true));
        }
        // Replace modified mxStylesheet node in doc
        mxStylesheetNode.getParentNode().replaceChild(newMxStylesheetNode, mxStylesheetNode);

        return doc;
    }

    private Document setMxDefaultToolbarNode(Document doc, String model, String categoryFilePath, String toolboxImagePath){
        Node mxDefaultToolbarNode = doc.getElementsByTagName("mxDefaultToolbar").item(0);

        boolean entryPointFound = false;
        // clone mxStylesheet node without children
        Node newMxDefaultToolbarNode = mxDefaultToolbarNode.cloneNode(false);
        // Loop through children of mxStylesheet node
        for (int i=0; i<mxDefaultToolbarNode.getChildNodes().getLength(); i++) {
            Node y = mxDefaultToolbarNode.getChildNodes().item(i);
            // Find entry point depending on the comments
            if (y.getNodeType() == Node.COMMENT_NODE && ((Comment)y).getData().equals(categoryFilePath)) {
                entryPointFound = true;
                // append comment node as well
                newMxDefaultToolbarNode.appendChild(y);
                continue;
            }
            // Append modified add node to newMxStylesheet node
            if (entryPointFound && y.getNodeType() == Node.ELEMENT_NODE) {
                // Ignore hr tag
                if (y.getNodeName() == "hr") {
                    newMxDefaultToolbarNode.appendChild(y.cloneNode(true));
                    continue;
                }

                Node newNode = y.cloneNode(true);
                Element newNodeElement = (Element)newNode;
                // set <add as="HC-SR04" template="HC-SR04" icon="images/hitech/ultrasonic-sensors/HC-SR04.jpg"/>
                newNodeElement.setAttribute("as", model.replace("-", " "));
                newNodeElement.setAttribute("template", model);
                newNodeElement.setAttribute("icon", toolboxImagePath);

                newMxDefaultToolbarNode.appendChild(newNode);
                entryPointFound = false;
            }
            // Add other add nodes to new mxStylesheet node
            newMxDefaultToolbarNode.appendChild(y.cloneNode(true));
        }
        // Replace modified mxStylesheet node in doc
        mxDefaultToolbarNode.getParentNode().replaceChild(newMxDefaultToolbarNode, mxDefaultToolbarNode);
        return doc;
    }

    private String nodeToString(Node node) {
        StringWriter sw = new StringWriter();
        try {
            Transformer t = TransformerFactory.newInstance().newTransformer();
//            t.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
//            t.setOutputProperty(OutputKeys.INDENT, "yes");
//            t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
            t.transform(new DOMSource(node), new StreamResult(sw));
        } catch (TransformerException te) {
            System.out.println("nodeToString Transformer Exception");
        }
        return sw.toString();
    }
}
