const path=require('path')
module.exports = {
    environment:'production',
   
    /*! **** LISTE DES APPLICATIONS ***/
    apps : ['admin'

           ],
    GOOGLE_API_KEY:"AIzaSyAnQcvnYDFzj1hHFK9CkbmPc9Dq2qh8-Mc",
    /*! ***** JETON ANTI FIXATION DE SESSION *****/
    SESSION_SECRET :"fa3d45b57acb0c0d1624a5401668a22e",
    CSRF_TOKEN : "a6e65e5ff8ba65062b6f946ba8dc97f9",
    SALT       : "7fe6492b09c24db1f18dd3f9a83b464b",
    default_admin :"admin",
    default_pw_admin :"admin",
    /*! ***** ROUTE DE LA RACINE DE L'APPLICATION ****/
    ROOT_DIR:__dirname,
    UPLOADS_DIR:__dirname+'/uploads',
    /*! ***** FICHIERS LIBRAIRIE ANGULAR *********/
    angular:['angular.min.js',
            'angular-route.min.js',
            'angular-sanitize.min.js'
            ],
    /*! PAR DEFAULT LE PROGRAMME CHARGE DANS LE CONTEXTE L'ENSEMBLE DES FICHIERS JAVASCRIPTS
     * PRESENTS COTE CLIENT DANS L'APPLICATION, POUR AVOIR UN COMPORTEMENT DIFFERENT VOUS POUVEZ
     * CONTINUER CE FICHIER */
    angular_commons:['admin/services.js',
                    'admin/directives.js'
            ],
    node_modules:path.join(__dirname,'node_modules'),
    scripts_common:['/jquery/dist/jquery.min.js',
                    '/bootstrap/dist/js/bootstrap.min.js',
                    '/tinymce/tinymce.min.js',
                    '/js/admin.js'],
    css_common:['/bootstrap/dist/css/bootstrap.min.css'],

    /*! CONFIGURATION DU SERVICE SMTP POUR LE FORMULAIRE DE CONTACT */
    MAIL_SERVICE:'Gmail',
    MAIL_USE_TLS:true,
    MAIL_EMAIL:'aikidopratt@yahoo.fr',
    /*MAIL_HOST:'smtp.manndrillapp.com',*/
    MAIL_DOMAIN:'mg.aikido-pratt.rhcloud.com',
    MAIL_USER:'aikidopratt@yahoo.fr',
    /*!MAIL_PASS:'JSOcpKIZtD369H7RVHK9Sw' mandrill api key'*/
    MAIL_PASS:'key-eea6844676b98647a7de8f8734a0e4f1',
    MAIL_PORT:587
    };

