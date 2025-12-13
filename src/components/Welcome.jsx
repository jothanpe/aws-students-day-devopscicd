import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome">
      <h1>🚀 AWS S3 Static Application</h1>
      <p className="subtitle">DevOps CI/CD con CodeBuild</p>
      <p className="description">
        Esta aplicación está desplegada en Amazon S3 usando AWS CodeBuild
      </p>
    </div>
  )
}

export default Welcome

