# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
# This file is included in the final Docker image and SHOULD be overridden when
# deploying the image to prod. Settings configured here are intended for use in local
# development environments. Also note that superset_config_docker.py is imported
# as a final step as a means to override "defaults" configured here
#
import logging
import os
from flask import request, redirect, g, flash, url_for, session
from celery.schedules import crontab
from flask_caching.backends.filesystemcache import FileSystemCache

from flask_appbuilder.security.sqla.models import User
from superset.security import SupersetSecurityManager
import jwt
from flask_appbuilder.security.manager import AUTH_DB
from flask_appbuilder.baseviews import expose
from flask_appbuilder.security.views import AuthDBView
from flask_login import login_user, current_user
from sqlalchemy import Column, String

class CustomAuthDBView(AuthDBView):
    @expose('/login/', methods=['GET', 'POST'])
    def login(self):
        jwt_token = request.args.get('jwt')
        if jwt_token:
            try:
                payload = jwt.decode(jwt_token, 'JvY3gMHOCDnleijfdGTrAbKXalys95QEEOM7u674dHLGW2Yk67zVI4I95orkVejp', algorithms=['HS256'])
                
                company_id = payload.get('company_id')
                username  = payload.get('username')
                email     = payload.get('email')
                first_name = payload.get('first_name', 'Dusys')
                last_name  = payload.get('last_name',  'Viewer')

                session['company_id'] = payload.get('company_id')

                user = self.appbuilder.sm.find_user(email=email)
                if not user:
                    user = self.appbuilder.sm.add_user(
                        username=username,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        role=self.appbuilder.sm.find_role('CompanyUser')
                    )
     
                
                login_user(user, remember=True)
                return redirect(url_for('TableModelView.list'))
            except jwt.ExpiredSignatureError:
                flash('Ocorreu um erro ao realizar o login automático!', 'warning')
            except jwt.InvalidTokenError:
                flash('Ocorreu um erro ao realizar o login automático!', 'warning')
            
        return super().login()
class CustomSecurityManager(SupersetSecurityManager):
    authdbview = CustomAuthDBView

CUSTOM_SECURITY_MANAGER = CustomSecurityManager

LANGUAGES = {
    "pt_BR": {"flag": "br", "name": "Brazilian Portuguese"},
}
BABEL_DEFAULT_LOCALE = "pt_BR"
AUTH_TYPE = AUTH_DB

APP_NAME = "Dusys - Superset"
APP_ICON="https://i.postimg.cc/9FHY1cCW/slym.png"

logger = logging.getLogger()

AUTH_USER_REGISTRATION = True  # Permite criação automática de usuários
AUTH_USER_REGISTRATION_ROLE = "EmpresaCriador" 

DATABASE_DIALECT = os.getenv("DATABASE_DIALECT")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_DB = os.getenv("DATABASE_DB")

EXAMPLES_USER = os.getenv("EXAMPLES_USER")
EXAMPLES_PASSWORD = os.getenv("EXAMPLES_PASSWORD")
EXAMPLES_HOST = os.getenv("EXAMPLES_HOST")
EXAMPLES_PORT = os.getenv("EXAMPLES_PORT")
EXAMPLES_DB = os.getenv("EXAMPLES_DB")

# The SQLAlchemy connection string.
SQLALCHEMY_DATABASE_URI = (
    f"{DATABASE_DIALECT}://"
    f"{DATABASE_USER}:{DATABASE_PASSWORD}@"
    f"{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DB}"
)

SQLALCHEMY_EXAMPLES_URI = (
    f"{DATABASE_DIALECT}://"
    f"{EXAMPLES_USER}:{EXAMPLES_PASSWORD}@"
    f"{EXAMPLES_HOST}:{EXAMPLES_PORT}/{EXAMPLES_DB}"
)

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
REDIS_CELERY_DB = os.getenv("REDIS_CELERY_DB", "0")
REDIS_RESULTS_DB = os.getenv("REDIS_RESULTS_DB", "1")

RESULTS_BACKEND = FileSystemCache("/app/superset_home/sqllab")

CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_DEFAULT_TIMEOUT": 300,
    "CACHE_KEY_PREFIX": "superset_",
    "CACHE_REDIS_HOST": REDIS_HOST,
    "CACHE_REDIS_PORT": REDIS_PORT,
    "CACHE_REDIS_DB": REDIS_RESULTS_DB,
}
DATA_CACHE_CONFIG = CACHE_CONFIG


class CeleryConfig:
    broker_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CELERY_DB}"
    imports = (
        "superset.sql_lab",
        "superset.tasks.scheduler",
        "superset.tasks.thumbnails",
        "superset.tasks.cache",
    )
    result_backend = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_RESULTS_DB}"
    worker_prefetch_multiplier = 1
    task_acks_late = False
    beat_schedule = {
        "reports.scheduler": {
            "task": "reports.scheduler",
            "schedule": crontab(minute="*", hour="*"),
        },
        "reports.prune_log": {
            "task": "reports.prune_log",
            "schedule": crontab(minute=10, hour=0),
        },
    }


CELERY_CONFIG = CeleryConfig
ENABLE_CORS = True  # Ativa CORS globalmente

# Configurações específicas de CORS
TALISMAN_ENABLED = False
CORS_OPTIONS = {
    "supports_credentials": True,
    "allow_headers": ["*"],
    "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    "origins": ["*"],  # Ou liste domínios específicos: ["http://seu-app-laravel.com"]
}

FEATURE_FLAGS = {
    "ALERT_REPORTS": True,

    "ALLOW_IFRAME_EMBED": True,
    "EMBEDDED_SUPERSET": True,
    "ENABLE_EXPLORE_DRAG_AND_DROP": True,
    "DASHBOARD_RBAC": True, 
    'PRESTO_EXPAND_DATA': False,
    "ENABLE_BABEL_LOCALIZATION": True,
}
HTTP_HEADERS = {"X-Frame-Options": "ALLOWALL"}
ALERT_REPORTS_NOTIFICATION_DRY_RUN = True
WEBDRIVER_BASEURL = "http://superset:8088/"  # When using docker compose baseurl should be http://superset_app:8088/
# The base URL for the email report hyperlinks.
WEBDRIVER_BASEURL_USER_FRIENDLY = WEBDRIVER_BASEURL
SQLLAB_CTAS_NO_LIMIT = True

#
# Optionally import superset_config_docker.py (which will have been included on
# the PYTHONPATH) in order to allow for local settings to be overridden
#
try:
    import superset_config_docker
    from superset_config_docker import *  # noqa

    logger.info(
        f"Loaded your Docker configuration at " f"[{superset_config_docker.__file__}]"
    )
except ImportError:
    logger.info("Using default Docker config...")
