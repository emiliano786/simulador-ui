import { defineStore } from 'pinia';
import { ref } from 'vue';

// Banco de Data Elements según ISO 8583 (estructura completa)
const dataElementBank = {
  '0': {
    ContentType: 'n',
    Label: 'Message type indicator',
    LenType: 'fixed',
    MinLen: 4,
    MaxLen: 4
  },
  '1': {
    ContentType: 'b',
    Label: 'Bit Map, Secondary',
    LenType: 'fixed',
    MaxLen: 16,
    MinLen: 16
  },
  '2': {
    ContentType: 'an',
    Label: 'Secondary Bitmap',
    LenType: 'fixed',
    MaxLen: 16,
    MinLen: 16
  },
  '4': {
    ContentType: 'n',
    Label: 'Transaction Amount',
    LenType: 'fixed',
    MaxLen: 12,
    MinLen: 12
  },
  '7': {
    ContentType: 'n',
    Label: 'Transmission Data and Time',
    LenType: 'fixed',
    MaxLen: 10,
    MinLen: 10
  },
  '11': {
    ContentType: 'n',
    Label: 'Systems trace audit number',
    LenType: 'fixed',
    MaxLen: 6,
    MinLen: 6
  },
  '12': {
    ContentType: 'n',
    Label: 'Local Transaction Time',
    LenType: 'fixed',
    MaxLen: 6,
    MinLen: 6
  },
  '13': {
    ContentType: 'n',
    Label: 'Local Transaction Date',
    LenType: 'fixed',
    MaxLen: 4,
    MinLen: 4
  },
  '17': {
    ContentType: 'n',
    Label: 'Capture Date',
    LenType: 'fixed',
    MaxLen: 4,
    MinLen: 4
  },
  '18': {
    ContentType: 'n',
    Label: 'Merchant Type',
    LenType: 'fixed',
    MaxLen: 4,
    MinLen: 4
  },
  '22': {
    ContentType: 'n',
    Label: 'Point of Service Entry Mode',
    LenType: 'fixed',
    MaxLen: 3,
    MinLen: 3
  },
  '25': {
    ContentType: 'n',
    Label: 'Point of Service Condition Code',
    LenType: 'fixed',
    MaxLen: 2,
    MinLen: 2
  },
  '32': {
    ContentType: 'n',
    Label: 'Acquiring Institution ID Code',
    LenType: 'llvar',
    MaxLen: 1,
    MinLen: 11
  },
  '35': {
    ContentType: 'ans',
    Label: 'Track 2 Data',
    LenType: 'llllvar',
    MaxLen: 1,
    MinLen: 37
  },
  '37': {
    ContentType: 'ans',
    Label: 'Retrieval Reference Number',
    LenType: 'fixed',
    MaxLen: 12,
    MinLen: 12
  },
  '38': {
    ContentType: 'an',
    Label: 'Authorization ID Response',
    LenType: 'fixed',
    MaxLen: 6,
    MinLen: 6
  },
  '39': {
    ContentType: 'an',
    Label: 'Response Code',
    LenType: 'fixed',
    MaxLen: 2,
    MinLen: 2
  },
  '41': {
    ContentType: 'ans',
    Label: 'Card Acceptor Terminal ID',
    LenType: 'fixed',
    MaxLen: 16,
    MinLen: 16
  },
  '42': {
    ContentType: 'ans',
    Label: 'Card Acceptor ID Code',
    LenType: 'fixed',
    MaxLen: 15,
    MinLen: 15
  },
  '43': {
    ContentType: 'ans',
    Label: 'Card Acceptor Name/Location',
    LenType: 'fixed',
    MaxLen: 40,
    MinLen: 40
  },
  '44': {
    ContentType: 'ans',
    Label: 'Additional Response Data',
    LenType: 'fixed',
    MaxLen: 4,
    MinLen: 4
  },
  '45': {
    ContentType: 'ans',
    Label: 'Track1 Data',
    LenType: 'fixed',
    MaxLen: 76,
    MinLen: 76
  },
  '48': {
    ContentType: 'ans',
    Label: 'Retailer Data',
    LenType: 'fixed',
    MaxLen: 30,
    MinLen: 30
  },
  '49': {
    ContentType: 'n',
    Label: 'Transaction Currency Code',
    LenType: 'fixed',
    MaxLen: 3,
    MinLen: 3
  },
  '54': {
    ContentType: 'n',
    Label: 'Additionals Amounts',
    LenType: 'fixed',
    MaxLen: 15,
    MinLen: 15
  },
  '57': {
    ContentType: 'n',
    Label: 'Expanded Token Buffer ',
    LenType: 'fixed',
    MaxLen: 15,
    MinLen: 15
  },
  '60': {
    ContentType: 'ans',
    Label: 'Terminal Data',
    LenType: 'fixed',
    MaxLen: 19,
    MinLen: 19
  },
  '61': {
    ContentType: 'ans',
    Label: 'Card Issuer-Category- Response Code Data',
    LenType: 'fixed',
    MaxLen: 22,
    MinLen: 22
  },
  '62': {
    ContentType: 'ans',
    Label: 'Postal Code',
    LenType: 'fixed',
    MaxLen: 13,
    MinLen: 13
  },
  '63': {
    ContentType: 'ans',
    Label: 'Additional Data',
    LenType: 'lllvar',
    MaxLen: 600,
    MinLen: 600
  },
  '70': {
    ContentType: 'n',
    Label: 'Network Management Information Code',
    LenType: 'fixed',
    MaxLen: 3,
    MinLen: 3
  },
  '90': {
    ContentType: 'an',
    Label: 'Original Data Elements',
    LenType: 'fixed',
    MaxLen: 42,
    MinLen: 42
  },
  '95': {
    ContentType: 'n',
    Label: 'Replacement Amounts',
    LenType: 'fixed',
    MaxLen: 42,
    MinLen: 42
  },
  '100': {
    ContentType: 'n',
    Label: 'Receiving Institution ID Code',
    LenType: 'llvar',
    MaxLen: 1,
    MinLen: 11
  },
  '102': {
    ContentType: 'ans',
    Label: 'Account ID 1',
    LenType: 'fixed',
    MaxLen: 28,
    MinLen: 28
  },
  '120': {
    ContentType: 'ans',
    Label: 'Terminal Address-Branch',
    LenType: 'fixed',
    MaxLen: 32,
    MinLen: 32
  },
  '121': {
    ContentType: 'ans',
    Label: 'Authorization Indicators',
    LenType: 'fixed',
    MaxLen: 23,
    MinLen: 23
  },
  '122': {
    ContentType: 'ans',
    Label: 'Card Issuer ID Code',
    LenType: 'fixed',
    MaxLen: 14,
    MinLen: 14
  },
  '123': {
    ContentType: 'ans',
    Label: 'Pos Invoice Data',
    LenType: 'fixed',
    MaxLen: 23,
    MinLen: 23
  },
  '125': {
    ContentType: 'ans',
    Label: 'Pos Settlement Data',
    LenType: 'fixed',
    MaxLen: 15,
    MinLen: 15
  },
  '126': {
    ContentType: 'ans',
    Label: 'Pos Preauthorization and Chrgeback Data',
    LenType: 'fixed',
    MaxLen: 41,
    MinLen: 41
  }
};

// Configuración de layouts predefinidos (actualizada con nuevos data elements)
const layoutConfigurations = {
  1: {
    id: '1',
    name: 'Layout Completo',
    description: 'Incluye todos los data elements mandatorios o condicionales según el estandar host POS emisor para mensajes financieros 0210.',
    dataElements: ['1', '3', '4', '7', '11', '12', '13', '15', '17', '18', '22', '25', '32', '35', '37', '38', '39', '41', '42', '44', '48', '49', '54', '57', '60', '61', '62', '63', '90', '95', '100', '102', '120', '121', '122', '125', '126']
  },
};

export const useLayoutStore = defineStore('layout', () => {
  // Función helper para obtener información de un data element
  const getDataElement = (elementId) => {
    return dataElementBank[elementId] || null;
  };

  // Función helper para obtener el label de un data element
  const getDataElementLabel = (elementId) => {
    const element = dataElementBank[elementId];
    return element ? element.Label : elementId;
  };

  // Función helper para obtener la descripción de un data element
  const getDataElementDescription = (elementId) => {
    const element = dataElementBank[elementId];
    if (!element) return '';

    return `${element.ContentType} - ${element.LenType} (${element.MinLen}-${element.MaxLen})`;
  };

  // Función para obtener un label customizado para un data element
  const getCustomDataElementLabel = (elementId) => {
    const element = dataElementBank[elementId];
    return element ? `DE_${elementId}: ${element.Label}` : `DE_${elementId}`;
  };

  // Función para obtener el nombre de un layout
  const getLayoutName = (layoutId) => {
    return layoutConfigurations[layoutId]?.name || layoutId;
  };

  // Función para obtener los data elements de un layout
  const getLayoutDataElements = (layoutId) => {
    return layoutConfigurations[layoutId]?.dataElements || [];
  };

  // Función para validar si un layout existe
  const isValidLayout = (layoutId) => {
    return layoutId in layoutConfigurations;
  };

  return {
    dataElementBank,
    layoutConfigurations,
    getDataElement,
    getDataElementLabel,
    getDataElementDescription,
    getCustomDataElementLabel,
    getLayoutName,
    getLayoutDataElements,
    isValidLayout
  };
});
