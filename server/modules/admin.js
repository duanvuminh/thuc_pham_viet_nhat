

const admin = require("firebase-admin")
admin.initializeApp({

    credential: admin.credential.cert({

        "type": "service_account",

        "project_id": "gaonhat-1b0c8",

        "private_key_id": "453555b8660552ae99b9c50ce8a2db053631216b",

        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3s7o1ZLrfrndo\nMN36FUnePCJ6iM3mT8L/3h0ge6h6VWodIc7oKQP2m42+qxRMmZPoGRXSB1VI7jny\nBg8IVZwf4X6Uky3/GfQrhXQ/6auIlHd9WDIcapPkl2HlYObR1YJuDQkW5a1mfVU9\n8u07QUDIR7Ck9vOl2uwLQ7UkQ6JdWRW7+PKSQMF7c+AeYn06spoOktfxmMgzrF+i\nAkghbKA2QIQnfFi61FIfp3QhwzU8pslbHZNDzt91sNLM08HHWAx4xfN5N3odAvTD\np4EmGGzKLVjKXjiAHp6q4ffrJ3mPwrchmzE53D+KKNCaUuIg10NdFXV7OOZHGcxf\nMWwyH7inAgMBAAECggEALJt9+f0ty6cn46sKG/ITb92WWb7ikKyJo2wiEoM0lBAt\npklRXtqm1blMICKW2UrpuZBt1gRl10HR3E1QVSvEr5EoFZfvsWRyACd15RcuygmT\nQmKqOHBA3V9NLE/tfMKl22da765x/tMsYdCdfqgHvRp7cHNvErUoYEverqGlyZiw\n9TI3zk6Kp0sUtrLhnnxO7HtKVyPIAjXRTgt5XP0bqmYVIT6A8lo7zyKFNMrzfNnq\n+B76ZXHVF1PnVBb1DQE60QrEPyAbCfvaUOGnn9pwOwh296tTotb3MnO+5iiAPNzb\ni2xqrTHahygs18lsBRinprfFFum7c37iUxgsWwYPsQKBgQDbM/HiTozlSrPMS6VK\nXXlbqmvSlPHY7oVMqxa5nTt9SKOe81Owfm9U0Q/7UtxaeZUZeEqOaOVLzaL+HtMr\n5WzL1gWC5pXX2tm283UUfWM3sitmhiIXQwFC+vwetBfc4VZgHvuHtEoflWnJUhlT\nzlcG0SBHwSxVF9oiESHEMYRq3QKBgQDWiioNMxiDhkUtPky3jjVDhrPkmluZbtHC\nX6FoWhHrDT4vkPORmsVYRSCm29Uv5Q2i2vmWAziucBbcXn+V+si72ovZM20PhCpl\nFaim3iVknyenLDqpOyR3wFKzMC+Fbjh4dy/T1d2r3B9i6Uc7iHGurJcj5yyre3YC\nGu4sT3SvUwKBgEXfBukWFL850pn6OtO7e+WGKxxSscxuKztHBdVgkwfaUZ1m/nQx\nuRcWFLwNq4ODYc1elJVURlKlV6Ec/j7twIIw1EznZzgI4ID6lYVUen3UYxUpCFDV\n4N8S1a6LxVd41GmLNq4I/9+VZsTvUHdwPDlGC74TiygMlFFrmJHLHuRZAoGAI3MP\nAcFYopr0IUazDH1+BZtjbDmpOxAZruF4XTLM1ScKCHgOFxgY1b4OaCPY9SIG/8rp\nBMWhfwlcbatbr5+RvaCeDRS3R6ISE0Ph6zi3uwmlVrUzODVikDsCL0OeBpEw2Y7w\nIzOqfjRQJ1ref1LLXg58pt0S/37WAAENK9sxL6sCgYBiUaWDyx49guVwsAFLk/hY\nJbQ4CY3h4u2PwIun0P8Wp3rVMb4xNRx3uiqu1WonvWyNQJCKZWIzmfIxjWP81Dd9\n6zAolSdVGrfBx/cpkk8p4SjPRNVDSgCw8o/USBzODLT7qS52W4xIxAg+AcSzOkFp\nXLleb8PhAy+mJfCz6+rKzw==\n-----END PRIVATE KEY-----\n",

        "client_email": "firebase-adminsdk-51mta@gaonhat-1b0c8.iam.gserviceaccount.com",

        "client_id": "100141061319010172362",

        "auth_uri": "https://accounts.google.com/o/oauth2/auth",

        "token_uri": "https://oauth2.googleapis.com/token",

        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",

        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-51mta%40gaonhat-1b0c8.iam.gserviceaccount.com"

    }),

    databaseURL: "https://gaonhat-1b0c8.firebaseio.com"

});

export default admin