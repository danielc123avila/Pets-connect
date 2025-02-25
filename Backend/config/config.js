var config = {
    email:{},
    sesiones:{}
}

//Encryption key word
config.palabraclave = "sayud2fqwyt3dfyqwfdyf3dtb5ywdf{ytqwfqwytl4fdywqtdyqwdyt4wqv"

//User virification (smpt Gmail)
config.email.host= "smtp.gmail.com"
config.email.port= 587
config.email.user = "jardtuexplain@gmail.com"
config.email.pass = "wswsxhtpnnghmccr"

//session, secret and expiration
config.sesiones.secret = "pure"
config.sesiones.expiracion = 20000*5

config.origins = [
    "http://localhost:4200"

]

export default config