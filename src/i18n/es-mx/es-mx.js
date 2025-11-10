export default {
  general: {
    version: 'Versión'
  },
  inputs: {
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña'
  },
  btns: {
    add: 'Agregar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    clear: 'Limpiar'
  },
  login: {
    socratesPhrase: 'Exos Simulator',
    welcome: '¡Bienvenido!',
    welcomeDescription: 'Por favor inicia sesión para continuar.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    login: 'Iniciar sesión',
    loginCred: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    goBack: 'Regresar',
    error: {
      title: 'Error de Autenticación',
      message: 'Las credenciales proporcionadas no son correctas.',
      details: 'Verifica los siguientes puntos:',
      close: 'Cerrar',
      verifyUsername: 'Verifica que el nombre de usuario sea correcto',
      verifyPassword: 'Verifica que la contraseña sea correcta',
      checkCapsLock: 'Asegúrate de que el bloqueo de mayúsculas esté desactivado'
    }
  },
  header: {
    title: 'Simulador'
  },
  footer: {
    copyright: '© 2023-{year}'
  },
  sidebar: {
    user: 'Usuario',
    userRole: 'Usuario del Sistema',
    deploysMonitoring: 'Monitoreo de Procesos',
    users: 'Usuarios',
    profiles: 'Perfiles',
    logout: 'Cerrar Sesión',
    logoutConfirmTitle: '¿Cerrar Sesión?',
    logoutConfirmMessage:
      '¿Estás seguro de que quieres cerrar tu sesión? Esta acción te redirigirá al login.',
    logoutCancel: 'Cancelar',
    logoutConfirm: 'Cerrar Sesión',
    logoutNote: 'Todos los cambios no guardados se perderán.'
  },
  deploysMonitoring: {
    title: 'Monitoreo de Procesos',
    description: 'Monitorea y gestiona tus procesos de aplicaciones.',
    newDeployment: 'Nuevo despliegue',
    viewDetails: 'Ver detalles y configuración',
    replicas: 'Pods',
    port: 'Puerto',
    tlsActive: 'TLS Activo',
    tlsInactive: 'TLS Inactivo',
    tlsDisabledMessage: 'TLS no está configurado para este proceso',
    tlsEnabledMessage: 'TLS está configurado para este proceso',
    expiresOn: 'Expira el',
    globalSearch: 'Búsqueda global',
    status: {
      pending: 'Pendiente',
      running: 'Ejecutándose',
      succeeded: 'Exitoso',
      failed: 'Fallido',
      unknown: 'Desconocido',
      'true': 'Terminado',
      'false': 'Ejecutándose'
    },
    filters: {
      criteriaTitle: 'Criterios de filtrado',
      search: 'Buscar por nombre',
      status: 'Estado',
      minPort: 'Puerto mínimo',
      maxPort: 'Puerto máximo',
      applyFilters: 'Aplicar filtros',
      clearFilters: 'Limpiar filtros',
      pendingStatus: 'Pendiente',
      runningStatus: 'Ejecutándose',
      succeededStatus: 'Exitoso',
      failedStatus: 'Fallido',
      unknownStatus: 'Desconocido'
    },
    restartDeploy: 'Reiniciar despliegue',
    restartAll: {
      title: 'Reiniciar todos los procesos existentes.'
    },
    actions: {
      edit: 'Editar',
      delete: 'Eliminar'
    },
    restart: {
      confirmation: {
        title: 'Confirmar Reinicio del proceso',
        message: 'Estás a punto de reiniciar el despliegue',
        messageEnd: '. Esta acción interrumpirá temporalmente el servicio.',
        deployInfo: 'Información del proceso',
        status: 'Estado',
        warnings: {
          title: 'Advertencias Importantes',
          serviceInterruption: 'Los servicios estarán temporalmente no disponibles',
          connectionLoss: 'Las conexiones activas se perderán',
          recoveryTime: 'La recuperación de los servicios puede tomar unos minutos'
        },
        cancel: 'Cancelar',
        confirm: 'Confirmar Reinicio'
      }
    },
    layout: {
      title: 'Layout de Data Elements',
      description: 'Configura el layout de data elements para este despliegue',
      currentLayout: 'Layout Actual',
      configureLayout: 'Configurar Layout',
      layoutOptions: 'Opciones de Layout',
      dataElements: 'Data Elements',
      layoutUpdated: 'Layout actualizado exitosamente',
      selectLayout: 'Selecciona un layout',
      layoutDescription: 'Descripción del Layout',
      elementsIncluded: 'Elementos incluidos en este layout'
    }
  },
  deployForm: {
    title: 'Detalles del despliegue',
    general: {
      title: 'General',
      description:
        'Configura los parámetros básicos del despliegue, incluyendo nombre, puerto, entorno que será desplegado y número de réplicas.',
      name: 'Nombre del despliegue',
      portServer: 'Puerto de escucha',
      portClient: 'Puerto de conexión',
      port: 'Puerto',
      deployTarget: 'Proceso',
      replicas: 'Réplicas'
    },
    logging: {
      title: 'Logging',
      description:
        'Define el nivel de logging para el despliegue. Un nivel más alto proporciona más información de depuración.',
      level: 'Nivel de logging',
      options: {
        debug: 'Debug',
        info: 'Info',
        severe: 'Severe'
      }
    },
    security: {
      title: 'Seguridad',
      description:
        'Configura la seguridad TLS y los certificados necesarios para el despliegue. Los certificados deben estar en formato PEM.',
      tlsActive: 'TLS Activo',
      tlsInactive: 'TLS Inactivo',
      secureConnections: 'Conexiones seguras habilitadas',
      insecureConnections: 'Conexiones no seguras',
      benefitsTitle: 'Beneficios activados',
      benefits: {
        encryption: 'Cifrado de datos en tránsito',
        authentication: 'Autenticación del servidor',
        integrity: 'Integridad de datos'
      },
      considerationsTitle: 'Consideraciones de seguridad',
      considerations: {
        unencrypted: 'Los datos se transmiten sin cifrar',
        noVerification: 'No se verifica la identidad del servidor',
        developmentOnly: 'Recomendado solo para entornos de desarrollo'
      },
      keyFile: 'Certificado .key',
      certFile: 'Certificado .cert',
      expiresOn: 'Expira',
      expiresSoon: 'El certificado expira pronto. Considera renovarlo.',
      expired: 'El certificado ha expirado. Debes renovarlo inmediatamente.',
      moreInfo: 'Más información',
      timeUnits: {
        days: 'días',
        day: 'día',
        months: 'meses',
        month: 'mes',
        years: 'años',
        year: 'año',
        expiresIn: 'Expira en',
        expiredAgo: 'Expiró hace',
        expiresToday: 'Expira hoy'
      }
    },
    actions: {
      saveChanges: 'Guardar cambios',
      updateDeploy: 'Actualizar despliegue',
      createDeploy: 'Crear despliegue',
      cancel: 'Cancelar',
      continue: 'Continuar',
      finish: 'Terminar',
      close: 'Cerrar'
    },
    delete: {
      title: 'Eliminar Deploy',
      deployToDelete: 'Deploy a Eliminar',
      status: 'Estado',
      tls: 'TLS',
      layout: 'Layout',
      dataElements: 'elementos de datos',
      tlsActive: 'TLS Activo',
      tlsInactive: 'TLS Inactivo',
      warningMessage:
        'Estás a punto de eliminar de forma permanente este deploy, sus contenedores y todos sus datos. Esta acción no se puede deshacer.',
      alternativeMessage:
        'Si no lo tienes claro, puedes resolver o cancelar esta acción en su lugar.',
      confirmationLabel: 'Escribe',
      confirmationText: 'eliminar',
      confirmationSuffix: 'para continuar con la eliminación del deploy',
      confirmationInputLabel: 'Confirmar eliminación',
      deleteButton: 'Eliminar'
    },
    confirmation: {
      title: 'Actualizar despliegue',
      createTitle: 'Crear despliegue',
      infoTitle: 'Confirmación de actualización',
      createInfoTitle: 'Confirmación de creación',
      infoMessage: 'Estás a punto de actualizar el despliegue',
      createInfoMessage: 'Estás a punto de crear un nuevo despliegue',
      infoMessageEnd: 'con los nuevos parámetros configurados.',
      createInfoMessageEnd: 'con los parámetros configurados.',
      processTitle: 'Proceso de actualización',
      createProcessTitle: 'Proceso de creación',
      steps: {
        validation: {
          title: 'Validación de configuración',
          description: 'Se verificarán todos los parámetros y certificados antes de proceder.'
        },
        application: {
          title: 'Aplicación de cambios',
          description: 'Se actualizarán los parámetros del despliegue y configuración TLS.'
        },
        createApplication: {
          title: 'Creación del despliegue',
          description:
            'El despliegue será creado con los parámetros especificados y configuración TLS.'
        },
        restart: {
          title: 'Reinicio controlado',
          description: 'El despliegue se reiniciará para aplicar los nuevos cambios.'
        },
        verification: {
          title: 'Verificación de estado',
          description: 'Se confirmará que el despliegue funcione correctamente.'
        }
      }
    },
    success: {
      title: '¡Actualización Exitosa!',
      createTitle: '¡Creación Exitosa!',
      message: 'El despliegue',
      createMessage: 'El despliegue',
      messageEnd: 'se ha actualizado correctamente con todos los nuevos parámetros y certificados.',
      createMessageEnd: 'se ha creado correctamente con todos los parámetros y certificados.',
      changesApplied: 'Cambios aplicados',
      createChangesApplied: 'Proceso creado',
      changes: {
        general: 'Configuración general actualizada',
        logging: 'Nivel de logging configurado',
        tls: 'Certificados TLS aplicados'
      },
      createChanges: {
        general: 'Configuración general aplicada',
        logging: 'Nivel de logging configurado',
        tls: 'Certificados TLS aplicados'
      },
      redirectNote: 'Serás redirigido a la vista de procesos para ver los cambios reflejados.'
    },
    error: {
      title: '¡Error en la Operación!',
      createTitle: '¡Error al Crear!',
      updateTitle: '¡Error al Actualizar!',
      message: 'Ha ocurrido un error al procesar la solicitud.',
      createMessage: 'Ha ocurrido un error al crear el despliegue.',
      updateMessage: 'Ha ocurrido un error al actualizar el despliegue.',
      errorDetail: 'Detalles del error:',
      redirectNote: 'Serás redirigido a la vista de procesos.',
      actions: {
        close: 'Cerrar'
      }
    }
  },
  layoutConfig: {
    title: 'Listado de mensajes',
    currentDeploy: 'Proceso Actual',
    noDeploySelected: 'Ningún despliegue seleccionado',
    currentLayout: 'Layout Actual',
    selectLayout: 'Seleccionar Layout',
    selectLayoutDescription:
      'Sube tu archivo json con el listado de mensajes que se van a mandar en la prueba en la propiedad testCases.',
    dataElementsIncluded: 'Data Elements Incluidos',
    useCase: 'Caso de Uso',
    cancel: 'Cancelar',
    applyChanges: 'Aplicar Cambios',
    confirmation: {
      title: 'Confirmar Cambio de Layout',
      message: 'Estás a punto de cambiar el layout de data elements para el despliegue',
      messageEnd: '. Esto actualizará la configuración del layout.',
      layoutChange: 'Cambio de Layout',
      from: 'Desde',
      cancel: 'Cancelar',
      apply: 'Aplicar Cambios'
    }
  },
  users: {
    title: 'Gestión de Usuarios',
    description: 'Gestiona los usuarios del sistema y sus permisos de acceso.',
    newUser: 'Nuevo usuario',
    updateUser: 'Actualizar usuario',
    deleteUser: 'Eliminar usuario',
    createUser: 'Crear usuario',
    deleteInfoMessage: 'Estás a punto de eliminar el usuario',
    deleteMessage: 'Hubo un error al eliminar el usuario',
    redirectNote: 'Serás redirigido a la vista de usuarios para ver los cambios reflejados.',
    successDelete: 'El usuario se ha eliminado correctamente del sistema.',
    form: {
      title: 'Detalles del Perfil',
      general: {
        titleUpdateuser: 'Actualizar Perfil',
        descriptionUpdateuser:
          'Modifica el perfil de usuario con permisos y configuraciones actualizadas.',
        titleCreateuser: 'Crear Perfil',
        decriptionCreateuser:
          'Define un nuevo perfil de usuario con permisos y configuraciones específicas.',
        title: 'Información General',
        description:
          'Configura la información básica del usuario incluyendo datos personales y credenciales.',
        name: 'Nombre',
        lastname: 'Apellidos',
        username: 'Usuario',
        password: 'Contraseña',
        userType: 'Tipo de Usuario',
        profile: 'Perfil',
        userName: 'Nombre',
        userDescription: 'Descripción',
        status: 'Estado',
        userInstitution: 'Institución',
        actions: 'Acciones',
        active: 'Activo',
        inactive: 'Inactivo',
        user: 'Perfil',
        email: 'Correo Electrónico',
        userToDelete: 'Perfil a eliminar',
        deleteUser: 'Usuario a eliminar'
      },
      actions: {
        saveChanges: 'Guardar cambios',
        createuser: 'Crear usuario',
        updateuser: 'Actualizar usuario',
        deleteuser: 'Eliminar usuario',
        cancel: 'Cancelar',
        continue: 'Continuar'
      },
      confirmation: {
        title: 'Actualizar usuario',
        createTitle: 'Crear usuario',
        deleteTitle: 'Eliminar usuario',
        infoTitle: 'Confirmación de actualización',
        createInfoTitle: 'Confirmación de creación',
        deleteInfoTitle: 'Confirmación de eliminación',
        infoMessage: 'Estás a punto de actualizar el usuario',
        createInfoMessage: 'Estás a punto de crear un nuevo usuario',
        deleteInfoMessage: 'Estás a punto de eliminar el usuario',
        infoMessageEnd: 'con los nuevos parámetros configurados.',
        createInfoMessageEnd: 'con los parámetros configurados.',
        deleteInfoMessageEnd: 'Esta acción no se puede deshacer.',
        processTitle: 'Proceso de actualización',
        createProcessTitle: 'Proceso de creación',
        deleteProcessTitle: 'Proceso de eliminación',
        steps: {
          validation: {
            title: 'Validación de información',
            description: 'Se verificarán todos los datos del usuario antes de proceder.'
          },
          application: {
            title: 'Aplicación de cambios',
            description: 'Se actualizará la información del usuario en el sistema.'
          },
          createApplication: {
            title: 'Creación del usuario',
            description: 'El usuario será creado con la información especificada.'
          },
          deleteApplication: {
            title: 'Eliminación del usuario',
            description: 'El usuario será eliminado permanentemente del sistema.'
          },
          verification: {
            title: 'Verificación',
            description: 'Se confirmará que el usuario fue procesado correctamente.'
          }
        }
      },
      success: {
        title: '¡Actualización Exitosa!',
        createTitle: '¡Creación Exitosa!',
        deleteTitle: '¡Eliminación Exitosa!',
        message: 'El usuario',
        createMessage: 'El usuario',
        deleteMessage: 'El usuario',
        messageEnd: 'se ha actualizado correctamente con todos los nuevos parámetros.',
        createMessageEnd: 'se ha creado correctamente con todos los parámetros.',
        deleteMessageEnd: 'se ha eliminado correctamente del sistema.',
        changesApplied: 'Cambios aplicados',
        createChangesApplied: 'usuario creado',
        deleteChangesApplied: 'usuario eliminado',
        changes: {
          general: 'Información general actualizada',
          credentials: 'Credenciales actualizadas'
        },
        createChanges: {
          general: 'Información general aplicada',
          credentials: 'Credenciales configuradas'
        },
        redirectNote: 'Serás redirigido a la vista de usuarios para ver los cambios reflejados.'
      },
      failed: {
        deleteTitle: 'Error al eliminar',
        deleteMessage: 'Hubo un error al eliminar el usuario'
      }
    }
  },
  profiles: {
    title: 'Mis perfiles',
    description: 'Gestiona los perfils y configuraciones personalizadas.',
    newProfile: 'Nuevo perfil',
    viewDetails: 'Ver detalles y configuración',
    deleteProfile: 'Eliminar perfil',
    editProfile: 'Editar perfil',
    form: {
      title: 'Detalles del Perfil',
      general: {
        titleUpdateProfile: 'Actualizar Perfil',
        descriptionUpdateProfile:
          'Modifica el perfil de perfil con permisos y configuraciones actualizadas.',
        titleCreateProfile: 'Crear Perfil',
        decriptionCreateProfile:
          'Define un nuevo perfil de perfil con permisos y configuraciones específicas.',
        title: 'Información General',
        description:
          'Configura la información básica del perfil incluyendo datos personales y credenciales.',
        name: 'Nombre',
        lastname: 'Apellidos',
        username: 'perfil',
        password: 'Contraseña',
        userType: 'Tipo de perfil',
        profileName: 'Nombre',
        profileDescription: 'Descripción',
        status: 'Estado',
        profileInstitution: 'Institución',
        actions: 'Acciones',
        active: 'Activo',
        inactive: 'Inactivo',
        profile: 'Perfil',
        email: 'Correo Electrónico',
        profileToDelete: 'Perfil a eliminar',
        deleteUser: 'perfil a eliminar'
      },
      actions: {
        saveChanges: 'Guardar cambios',
        createProfile: 'Crear perfil',
        updateProfile: 'Actualizar perfil',
        deleteProfile: 'Eliminar perfil',
        cancel: 'Cancelar',
        continue: 'Continuar'
      },
      confirmation: {
        title: 'Actualizar perfil',
        createTitle: 'Crear perfil',
        deleteTitle: 'Eliminar perfil',
        infoTitle: 'Confirmación de actualización',
        createInfoTitle: 'Confirmación de creación',
        deleteInfoTitle: 'Confirmación de eliminación',
        infoMessage: 'Estás a punto de actualizar el perfil',
        createInfoMessage: 'Estás a punto de crear un nuevo perfil',
        deleteInfoMessage: 'Estás a punto de eliminar el perfil',
        infoMessageEnd: 'con los nuevos parámetros configurados.',
        createInfoMessageEnd: 'con los parámetros configurados.',
        deleteInfoMessageEnd: 'Esta acción no se puede deshacer.',
        processTitle: 'Proceso de actualización',
        createProcessTitle: 'Proceso de creación',
        deleteProcessTitle: 'Proceso de eliminación',
        steps: {
          validation: {
            title: 'Validación de información',
            description: 'Se verificarán todos los datos del perfil antes de proceder.'
          },
          application: {
            title: 'Aplicación de cambios',
            description: 'Se actualizará la información del perfil en el sistema.'
          },
          createApplication: {
            title: 'Creación del perfil',
            description: 'El perfil será creado con la información especificada.'
          },
          deleteApplication: {
            title: 'Eliminación del perfil',
            description: 'El perfil será eliminado permanentemente del sistema.'
          },
          verification: {
            title: 'Verificación',
            description: 'Se confirmará que el perfil fue procesado correctamente.'
          }
        }
      },
      success: {
        title: '¡Actualización Exitosa!',
        createTitle: '¡Creación Exitosa!',
        deleteTitle: '¡Eliminación Exitosa!',
        message: 'El perfil',
        createMessage: 'El perfil',
        deleteMessage: 'El perfil',
        messageEnd: 'se ha actualizado correctamente con todos los nuevos parámetros.',
        createMessageEnd: 'se ha creado correctamente con todos los parámetros.',
        deleteMessageEnd: 'se ha eliminado correctamente del sistema.',
        changesApplied: 'Cambios aplicados',
        createChangesApplied: 'perfil creado',
        deleteChangesApplied: 'perfil eliminado',
        changes: {
          general: 'Información general actualizada',
          credentials: 'Credenciales actualizadas'
        },
        createChanges: {
          general: 'Información general aplicada',
          credentials: 'Credenciales configuradas'
        },
        redirectNote: 'Serás redirigido a la vista de perfiles para ver los cambios reflejados.'
      },
      failed: {
        deleteTitle: 'Error al eliminar',
        deleteMessage: 'Hubo un error al eliminar el perfil'
      }
    }
  },
  profileCreation: {
    form: {
      permissions: {
        title: 'Permisos',
        options: 'Opciones',
        actions: 'Acciones',
        hideAll: 'Ocultar todo',
        showAll: 'Mostrar todo'
      }
    }
  },
  modules: {
    manage: 'Gestor de Procesos',
    user: 'Usuarios',
    profiles: 'Perfiles'
  },
  actions: {
    list: 'Consultar',
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    restart: 'Reiniciar'
  },
  deploys: {
    successDelete: 'El proceso se ha eliminado correctamente del sistema',
    redirectNote: 'Serás redirigido a la vista de procesos para ver los cambios reflejados.',
    errorDetail: 'Hubo un problema al querer eliminar el proceso '
  }
};
