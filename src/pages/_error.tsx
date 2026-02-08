// Custom error page that avoids useContext issues
// caused by Windows path case-sensitivity creating duplicate React instances

function Error({ statusCode }: { statusCode?: number }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>
                    {statusCode || 'Error'}
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#999' }}>
                    {statusCode === 404
                        ? 'Page not found'
                        : 'An error occurred'}
                </p>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        marginTop: '2rem',
                        padding: '0.75rem 2rem',
                        backgroundColor: '#f97316',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                    }}
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode?: number }; err?: { statusCode?: number } }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
