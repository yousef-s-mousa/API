const fs = require('fs');
const path = require('path');

/**
 * Helper function to read JSON file synchronously
 * @param {string} fileName - Name of the JSON file in /data folder
 * @returns {Array} - Parsed JSON data
 */
const readJSONFile = (fileName) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', fileName);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error.message);
    throw new Error(`Failed to read data from ${fileName}`);
  }
};

/**
 * Get all basic users
 * GET /api/users
 */
const getAllBasicUsers = (req, res) => {
  try {
    const users = readJSONFile('basicUsers.json');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
};

/**
 * Get a single basic user by ID
 * GET /api/users/:id
 */
const getBasicUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Validate ID is a number
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }

    const users = readJSONFile('basicUsers.json');
    const user = users.find(u => u.id === userId);

    // Return 404 if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `User with ID ${userId} does not exist`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
};

/**
 * Get all detailed users
 * GET /api/users/details
 */
const getAllDetailedUsers = (req, res) => {
  try {
    const users = readJSONFile('detailedUsers.json');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve detailed users',
      message: error.message
    });
  }
};

/**
 * Get a single detailed user by ID
 * GET /api/users/details/:id
 */
const getDetailedUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Validate ID is a number
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }

    const users = readJSONFile('detailedUsers.json');
    const user = users.find(u => u.id === userId);

    // Return 404 if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `Detailed user with ID ${userId} does not exist`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve detailed user',
      message: error.message
    });
  }
};

/**
 * Helper function to convert JSON object to SOAP XML format
 * @param {Object} data - Data to convert
 * @param {string} elementName - Root element name
 * @returns {string} - SOAP XML string
 */
const jsonToSoap = (data, elementName = 'User') => {
  const convertToXml = (obj, indent = '      ') => {
    let xml = '';
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        xml += `${indent}<${key} />\n`;
      } else if (Array.isArray(value)) {
        xml += `${indent}<${key}>\n`;
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            xml += `${indent}  <item>\n`;
            xml += convertToXml(item, indent + '    ');
            xml += `${indent}  </item>\n`;
          } else {
            xml += `${indent}  <item>${item}</item>\n`;
          }
        });
        xml += `${indent}</${key}>\n`;
      } else if (typeof value === 'object') {
        xml += `${indent}<${key}>\n`;
        xml += convertToXml(value, indent + '  ');
        xml += `${indent}</${key}>\n`;
      } else {
        xml += `${indent}<${key}>${value}</${key}>\n`;
      }
    }
    return xml;
  };

  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserResponse>
      <${elementName}>
${convertToXml(data)}      </${elementName}>
    </GetUserResponse>
  </soap:Body>
</soap:Envelope>`;

  return soapEnvelope;
};

/**
 * Get all detailed users in SOAP format
 * GET /api/users/details/soap
 */
const getAllDetailedUsersSOAP = (req, res) => {
  try {
    const users = readJSONFile('detailedUsers.json');
    
    // Convert array of users to SOAP
    const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetAllUsersResponse>
      <Users count="${users.length}">
${users.map(user => {
  const userXml = jsonToSoap(user, 'User');
  // Extract just the User element part
  const match = userXml.match(/<User>([\s\S]*?)<\/User>/);
  return match ? `        <User>\n${match[1]}        </User>` : '';
}).join('\n')}
      </Users>
    </GetAllUsersResponse>
  </soap:Body>
</soap:Envelope>`;

    res.set('Content-Type', 'application/soap+xml; charset=utf-8');
    res.status(200).send(soapResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve detailed users',
      message: error.message
    });
  }
};

/**
 * Get a single detailed user by ID in SOAP format
 * GET /api/users/details/soap/:id
 */
const getDetailedUserByIdSOAP = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Validate ID is a number
    if (isNaN(userId)) {
      const errorSoap = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>Invalid user ID</faultstring>
      <detail>User ID must be a number</detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`;
      res.set('Content-Type', 'application/soap+xml; charset=utf-8');
      return res.status(400).send(errorSoap);
    }

    const users = readJSONFile('detailedUsers.json');
    const user = users.find(u => u.id === userId);

    // Return SOAP fault if user not found
    if (!user) {
      const errorSoap = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>User not found</faultstring>
      <detail>Detailed user with ID ${userId} does not exist</detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`;
      res.set('Content-Type', 'application/soap+xml; charset=utf-8');
      return res.status(404).send(errorSoap);
    }

    const soapResponse = jsonToSoap(user, 'User');
    res.set('Content-Type', 'application/soap+xml; charset=utf-8');
    res.status(200).send(soapResponse);
  } catch (error) {
    const errorSoap = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Internal server error</faultstring>
      <detail>${error.message}</detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`;
    res.set('Content-Type', 'application/soap+xml; charset=utf-8');
    res.status(500).send(errorSoap);
  }
};

module.exports = {
  getAllBasicUsers,
  getBasicUserById,
  getAllDetailedUsers,
  getDetailedUserById,
  getAllDetailedUsersSOAP,
  getDetailedUserByIdSOAP
};
