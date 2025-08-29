// Re-export individual components for backward compatibility
export { CollaborationPortfolio as CollaborationPortfolioSection } from '../collaboration/CollaborationPortfolio'
export { CollaborationProcess } from '../collaboration/CollaborationProcess'
export { CollaborationServices } from '../collaboration/CollaborationServices'
export { CollaborationSuccessStories } from '../collaboration/CollaborationSuccessStories'

// Import the components for default export
import { CollaborationPortfolio } from '../collaboration/CollaborationPortfolio'
import { CollaborationProcess } from '../collaboration/CollaborationProcess'
import { CollaborationServices } from '../collaboration/CollaborationServices'
import { CollaborationSuccessStories } from '../collaboration/CollaborationSuccessStories'

export default {
  CollaborationPortfolioSection: CollaborationPortfolio,
  CollaborationProcess,
  CollaborationServices,
  CollaborationSuccessStories,
}
