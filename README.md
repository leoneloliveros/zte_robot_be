# zte_robot_be

## Applications

- Postgresql (DB)
- Minio (SSO)
- Nodejs (BE)
  

## Docker Commands

```sh
  docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=access_key" -e "MINIO_SECRET_KEY=secret_key" -v /ruta/local/data:/data minio/minio server /data
  
```

```sh
  docker run --name postgres-db -e POSTGRES_PASSWORD=password_pg -e POSTGRES_DB=robot_be_db -p 5432:5432 -v /ruta/local/postgres-data:/var/lib/postgresql/data -d postgres:latest
```
