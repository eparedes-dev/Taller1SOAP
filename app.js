const express = require('express');
const app = express();
const soap = require('soap');
const port = 3000;

app.get('/', (req, res) => {
    res.send("Inicio de Servicio SOAP");
});

const service = {
    ServicioSuma: {
      PuertoOperaciones: {
        FuncionSuma: function(args) {
          return {
            resultado: args.valor + 10
          };
        }
      }
    }
  };

  const wsdl = `
  <definitions name="ServicioSuma" targetNamespace="http://example.com/wsdl" xmlns="http://schemas.xmlsoap.org/wsdl/">
    <!-- Tipos de datos definidos en el esquema XML -->
    <types>
      <schema xmlns="http://www.w3.org/2001/XMLSchema">
        <!-- Definición de la estructura de la solicitud -->
        <element name="ValorSuma">
          <complexType>
            <sequence>
              <element name="valor" type="xsd:int"/>
            </sequence>
          </complexType>
        </element>
        <!-- Definición de la estructura de la respuesta -->
        <element name="Respuesta">
          <complexType>
            <sequence>
              <element name="resultado" type="xsd:int"/>
            </sequence>
          </complexType>
        </element>
      </schema>
    </types>

    <!-- Definición de mensajes -->
    <message name="ValorSuma">
      <part name="parameters" element="tns:ValorSuma"/>
    </message>
    <message name="Respuesta">
      <part name="parameters" element="tns:Respuesta"/>
    </message>

    <!-- Definición del portType (interfaz del servicio) -->
    <portType name="PuertoOperaciones">
      <operation name="FuncionSuma">
        <input message="tns:ValorSuma"/>
        <output message="tns:Respuesta"/>
      </operation>
    </portType>

    <!-- Definición del binding (configuración de la comunicación) -->
    <binding name="DefinicionProtocolo" type="tns:PuertoOperaciones">
      <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
      <operation name="FuncionSuma">
        <soap:operation soapAction="FuncionSuma"/>
        <input>
          <soap:body use="encoded" namespace="http://example.com/soap" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
        </input>
        <output>
          <soap:body use="encoded" namespace="http://example.com/soap" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
        </output>
      </operation>
    </binding>

    <!-- Definición del servicio -->
    <service name="ServicioSuma">
      <port name="PuertoOperaciones" binding="tns:DefinicionProtocolo">
        <soap:address location="http://localhost:3000/wsdl"/>
      </port>
    </service>
  </definitions>
`;



  const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    soap.listen(server, '/wsdl', service, wsdl);
  });