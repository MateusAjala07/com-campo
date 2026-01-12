
# ComCampo

Aplicativo voltado para área rural



## Instalação

Instale o projeto com npm

```bash
  npm install
  npx expo prebuild
```
- Crie arquivo dentro da pasta android chamado "local.properties" e colar 
```bash
  sdk.dir=C:\\Users\\Comsystem\\AppData\\Local\\Android\\Sdk
```

No lugar de "Comsystem" deve ser colocado o nome do usuario da maquina

Para iniciar o projeto 
```bash
  npm run android
```
## Deploy

Para fazer o deploy desse projeto rode

### Nativo
```bash
  cd android
  ./gradlew assembleRelease
```
Ou
### EAS
```bash
  eas build -p android --profile preview
```
## Documentação de cores

| Cor               | Hexadecimal                                                |
| ----------------- | ---------------------------------------------------------------- |
| Cor primária       | ![#47a603](https://via.placeholder.com/10/47a603?text=+) #47a603 |
| Cor secundária       | ![#0d4036](https://via.placeholder.com/10/0d4036?text=+) #0d4036 |
| Cor background       | ![#f4f6f8](https://via.placeholder.com/10/f4f6f8?text=+) #f4f6f8 |


## Autor

- Iran Mota da Silva

