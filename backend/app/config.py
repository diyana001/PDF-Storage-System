from pydantic_settings import BaseSettings,SettingsConfigDict
class Settings(BaseSettings):
    app_name:str='PDF Vault API'
    api_prefix:str='/api/v1'
    cors_origins:str='http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174'
    max_upload_mb:int=25
    storage_dir:str='storage/pdfs'
    database_url:str='sqlite:///./storage/pdf_vault.db'
    auth_secret:str='change-this-development-secret'
    auth_token_minutes:int=60
    model_config=SettingsConfigDict(env_file='.env',extra='ignore')
    @property
    def allowed_origins(self): return [x.strip() for x in self.cors_origins.split(',') if x.strip()]
settings=Settings()
