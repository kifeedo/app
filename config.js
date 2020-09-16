const path=require('path')
module.exports = {
    environment:'production',
   
    /*! **** LISTE DES APPLICATIONS ***/
    apps : ['admin'

           ],
    /*! ***** JETON ANTI FIXATION DE SESSION *****/
    SESSION_SECRET :"fa3d45b57acb0c0d1624a5401668a22e",
    CSRF_TOKEN : "a6e65e5ff8ba65062b6f946ba8dc97f9",
    SALT       : "7fe6492b09c24db1f18dd3f9a83b464b",
    
    /*! ***** ROUTE DE LA RACINE DE L'APPLICATION ****/
    ROOT_DIR:__dirname,
    UPLOADS_DIR:__dirname+'/uploads',
    
    node_modules:path.join(__dirname,'node_modules'),
    scripts_common:['/jquery/dist/jquery.min.js',
                    '/bootstrap/dist/js/bootstrap.min.js',
                    '/tinymce/tinymce.min.js',
                    '/js/admin.js'],
    css_common:['/bootstrap/dist/css/bootstrap.min.css'],
    };

