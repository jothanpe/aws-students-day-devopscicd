import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome">
      <h1>🚀 AWS Students Community Day - Perú</h1>
      <p className="subtitle">CI/CD con CodePipeline y CodeBuild</p>
      <p className="description">
        Esta aplicación está desplegada en Amazon S3 usando AWS CodeBuild
      </p>
      
      <div className="images-container">
        <div className="image-card">
          <img 
            src="/AWSCommunities.jpg" 
            alt="AWS Communities" 
            className="community-image"
          />
          <p className="image-label">AWS Communities</p>
        </div>
        <div className="image-card">
          <img 
            src="/AWSReInvent-Profile.jpg" 
            alt="AWS ReInvent Profile" 
            className="community-image"
          />
          <p className="image-label">AWS ReInvent</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome

