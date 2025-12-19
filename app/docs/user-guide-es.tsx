export function UserGuideEs() {
    return (
        <article className="prose prose-blue dark:prose-invert max-w-none">
            <h1>Guía de Usuario de Easy Attest</h1>

            <p className="lead">
                ¡Bienvenido a Easy Attest! Esta guía te ayudará a entender cómo usar la plataforma para crear esquemas, hacer atestaciones y construir tu reputación onchain.
            </p>

            <h2>Comenzando</h2>

            <h3>Lo que necesitarás</h3>
            <ul>
                <li>Una billetera Web3 (Coinbase Wallet, MetaMask o compatible con WalletConnect)</li>
                <li>Una pequeña cantidad de ETH en la red Base para las tarifas de gas</li>
                <li>(Opcional) Una cuenta de Farcaster para compartir en redes sociales</li>
            </ul>

            <h3>Configuración Inicial</h3>
            <ol>
                <li>
                    <strong>Instala una Billetera</strong>
                    <p>Descarga la extensión de navegador de Coinbase Wallet o MetaMask, crea una nueva billetera o importa una existente, y asegura tu frase semilla.</p>
                </li>
                <li>
                    <strong>Obtén ETH en Base</strong>
                    <p>Envía ETH desde la red principal de Ethereum usando el Puente de Base o usa un exchange centralizado que soporte retiros en Base.</p>
                </li>
                <li>
                    <strong>Conecta con Easy Attest</strong>
                    <p>Visita la aplicación Easy Attest, haz clic en &quot;Conectar Billetera&quot;, selecciona tu billetera y aprueba la conexión.</p>
                </li>
            </ol>

            <h2>Entendiendo las Atestaciones</h2>
            <p>
                Una atestación es una declaración firmada almacenada permanentemente en la blockchain. Piénsalo como una credencial digital o endoso que no puede ser falsificado ni eliminado.
            </p>
            <ul>
                <li><strong>Permanente:</strong> Una vez creadas, las atestaciones existen para siempre en la blockchain</li>
                <li><strong>Verificable:</strong> Cualquiera puede verificar la autenticidad de una atestación</li>
                <li><strong>Portable:</strong> Tus atestaciones te pertenecen y funcionan en diferentes aplicaciones</li>
            </ul>

            <h2>Creando Esquemas</h2>
            <p>
                Un esquema es una plantilla que define qué información contiene una atestación. Es como una estructura de formulario que asegura la consistencia.
            </p>

            <h3>Paso a Paso: Creando un Esquema</h3>
            <ol>
                <li><strong>Planifica tu Esquema:</strong> Decide qué campos necesitas (ej. nombre del evento, fecha, rol).</li>
                <li><strong>Abre el Constructor de Esquemas:</strong> Navega a &quot;Crear Schema&quot;.</li>
                <li><strong>Añade Campos:</strong> Haz clic en &quot;Añadir Campo&quot; y define el nombre, tipo y si es obligatorio.</li>
                <li><strong>Revisa la Vista Previa:</strong> Verifica la cadena del esquema generada.</li>
                <li><strong>Envía la Transacción:</strong> Haz clic en &quot;Crear Schema&quot; y confirma en tu billetera.</li>
            </ol>

            <h2>Haciendo Atestaciones</h2>
            <p>
                Haz una atestación para endosar las habilidades de alguien, verificar participación o confirmar la finalización de una tarea.
            </p>

            <h3>Paso a Paso: Haciendo una Atestación</h3>
            <ol>
                <li><strong>Selecciona un Esquema:</strong> Navega a &quot;Crear Atestación&quot; y selecciona un esquema (o usa una plantilla).</li>
                <li><strong>Ingresa el Destinatario:</strong> Introduce la dirección de Ethereum, nombre ENS o usuario de Farcaster del destinatario.</li>
                <li><strong>Completa los Datos:</strong> Ingresa la información requerida para la atestación.</li>
                <li><strong>Revisa la Información:</strong> Verifica todo dos veces, ya que las atestaciones son permanentes.</li>
                <li><strong>Envía la Transacción:</strong> Haz clic en &quot;Crear Atestación&quot; y aprueba en tu billetera.</li>
            </ol>

            <h2>Gestionando tu Reputación</h2>
            <p>
                Tu panel es tu centro de reputación. Puedes ver las atestaciones que has recibido y dado, filtrar por tipo o fecha, y compartir tu reputación a través de enlaces directos o Farcaster.
            </p>
        </article>
    );
}
