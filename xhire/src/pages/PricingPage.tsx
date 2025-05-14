import { FiCheck, FiX } from 'react-icons/fi';
import Layout from '../components/Layout';

const PricingPage: React.FC = () => {
  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for casual job seekers',
      features: [
        'Limited job feed results',
        'Save up to 5 bookmarks',
        'Basic search filters',
      ],
      limitations: [
        'No job alerts',
        'No AI-powered summaries',
        'No skill-based feed',
      ],
      buttonText: 'Get Started',
      buttonLink: '/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '₹199',
      period: 'per month',
      yearlyPrice: '₹1499 per year',
      yearlyDiscount: 'Save ₹889',
      description: 'For serious job hunters',
      features: [
        'Unlimited job results',
        'Save up to 50 bookmarks',
        'All advanced filters',
        'Personalized job alerts',
        'AI-powered job summaries',
        'Skill-based feed customization',
        'Priority support',
      ],
      limitations: [],
      buttonText: 'Subscribe Now',
      buttonLink: '/register?plan=pro',
      highlighted: true,
    },
    {
      name: 'Team',
      price: 'Custom',
      period: 'billing',
      description: 'For placement cells & bootcamps',
      features: [
        'All Pro features',
        'Multiple user accounts',
        'Team dashboard',
        'Bulk candidate management',
        'Analytics & reporting',
        'API access',
        'Custom branding options',
        'Dedicated account manager',
      ],
      limitations: [],
      buttonText: 'Contact Us',
      buttonLink: '/contact',
      highlighted: false,
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-dark text-lg mb-6 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans give you access to job opportunities 
            from Twitter you won't find anywhere else.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`
                bg-white rounded-xl overflow-hidden transition-shadow
                ${plan.highlighted 
                  ? 'shadow-xl ring-2 ring-primary' 
                  : 'shadow-md hover:shadow-lg'
                }
              `}
            >
              {/* Plan Header */}
              <div className={`p-6 ${plan.highlighted ? 'bg-primary text-white' : 'bg-lighter'}`}>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm ml-1 mb-1">/{plan.period}</span>
                  )}
                </div>
                {plan.yearlyPrice && (
                  <div className="text-sm mb-2">
                    <span>{plan.yearlyPrice}</span>
                    <span className="ml-2 bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full text-xs">
                      {plan.yearlyDiscount}
                    </span>
                  </div>
                )}
                <p className={`text-sm ${plan.highlighted ? 'text-white text-opacity-80' : 'text-dark'}`}>
                  {plan.description}
                </p>
              </div>
              
              {/* Plan Features */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-secondary">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-secondary">Limitations</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-dark">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <a
                  href={plan.buttonLink}
                  className={`
                    block w-full text-center py-2 rounded-md font-medium transition-colors
                    ${plan.highlighted
                      ? 'bg-primary text-white hover:bg-blue-600'
                      : 'bg-white text-primary border border-primary hover:bg-lighter'
                    }
                  `}
                >
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Can I cancel my subscription anytime?</h3>
              <p className="text-dark">
                Yes, you can cancel your subscription at any time. Once canceled, you'll 
                continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">How do job alerts work?</h3>
              <p className="text-dark">
                Job alerts are sent based on your skill preferences and search history. 
                Pro subscribers can set daily or weekly alerts for specific roles or companies.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Do you offer a free trial?</h3>
              <p className="text-dark">
                We don't currently offer a free trial, but our Free plan gives you access 
                to basic features so you can try the platform before upgrading.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">How accurate are the AI summaries?</h3>
              <p className="text-dark">
                Our AI summaries extract key information like role, company, location, and salary 
                with high accuracy. We're constantly improving the AI model for better results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage; 