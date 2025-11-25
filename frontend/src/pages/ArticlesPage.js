import React from 'react';
import PageTransition from '../components/Common/PageTransition';

const ArticlesPage = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-bg-dark-primary text-text-light pt-24">
                <div className="max-w-4xl mx-auto py-10 px-4">
                    <h1 className="text-4xl font-extrabold text-brand-accent mb-10 text-center">Real Estate Articles & News</h1>
                    
                    {/* Article 1: Market Trends */}
                    <div className="bg-bg-dark-card rounded-xl shadow-2xl border border-gray-700 overflow-hidden mb-12">
                        {/* Image for Market Trends */}
                        <img 
                            src="https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                            alt="Bengaluru Market Trends"
                            className="w-full h-64 object-cover"
                            onError={(e) => e.target.src = 'https://placehold.co/800x400/1E293B/FF0000?text=Image+Load+Error'}
                        />
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-brand-primary mb-4">Market Trends 2025: Bengaluru</h2>
                            <p className="text-text-muted mb-4 text-base leading-relaxed">
                                The Bengaluru real estate market in 2025 continues its dynamic trajectory, fueled by the relentless expansion of the IT/ITeS sector and a thriving startup ecosystem. Infrastructure developments, particularly the Namma Metro expansion, are unlocking new micro-markets and enhancing connectivity.
                            </p>
                            <p className="text-text-muted mb-6 text-base leading-relaxed">
                                We're observing sustained high demand in established hubs like Whitefield and Koramangala, while northern corridors like Hebbal and Yelahanka are experiencing significant price appreciation due to their proximity to the airport and major commercial parks. Sustainable, green buildings are also becoming a key decision factor for new buyers.
                            </p>
                            <a href="#" className="text-brand-accent hover:underline font-semibold text-lg">
                                Read Full Report &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Article 2: RERA Updates */}
                    <div className="bg-bg-dark-card rounded-xl shadow-2xl border border-gray-700 overflow-hidden mb-12">
                        {/* Image for RERA Updates */}
                        <img 
                            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                            alt="RERA Updates"
                            className="w-full h-64 object-cover"
                            onError={(e) => e.target.src = 'https://placehold.co/800x400/1E293B/FF0000?text=Image+Load+Error'}
                        />
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-brand-primary mb-4">RERA Updates: What Homebuyers Need to Know</h2>
                            <p className="text-text-muted mb-4 text-base leading-relaxed">
                                Recent updates to the Real Estate (Regulation and Development) Act (RERA) in Karnataka are set to further bolster buyer confidence. The latest amendments focus on enhancing transparency for all off-plan (under-construction) properties, mandating stricter adherence to project completion timelines.
                            </p>
                            <p className="text-text-muted mb-6 text-base leading-relaxed">
                                A new digital-first grievance redressal portal has been launched, simplifying the process for homebuyers to file complaints and track their status. These moves aim to bring greater accountability to developers and ensure that the interests of the end-user are protected above all.
                            </p>
                            <a href="#" className="text-brand-accent hover:underline font-semibold text-lg">
                                Learn More &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Article 3: Investment Hotspots */}
                    <div className="bg-bg-dark-card rounded-xl shadow-2xl border border-gray-700 overflow-hidden mb-12">
                        {/* Image for Investment Hotspots */}
                        <img 
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                            alt="Investment Hotspots"
                            className="w-full h-64 object-cover"
                            onError={(e) => e.target.src = 'https://placehold.co/800x400/1E293B/FF0000?text=Image+Load+Error'}
                        />
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-brand-primary mb-4">Top 5 Up-and-Coming Neighbourhoods in Bengaluru</h2>
                            <p className="text-text-muted mb-4 text-base leading-relaxed">
                                Looking for the next big thing? Beyond the usual suspects, several Bengaluru neighbourhoods are poised for exponential growth. We analyze the top 5 areas based on new infrastructure, commercial development, and quality of life.
                            </p>
                            <p className="text-text-muted mb-6 text-base leading-relaxed">
                                Areas like Sarjapur and Yelahanka New Town are rapidly transforming from 'outskirts' into self-sustaining residential ecosystems with top-tier schools, hospitals, and retail. Find out if your next investment is on this list.
                            </p>
                            <a href="#" className="text-brand-accent hover:underline font-semibold text-lg">
                                See the List &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Article 4: Home Loan Tips */}
                    <div className="bg-bg-dark-card rounded-xl shadow-2xl border border-gray-700 overflow-hidden mb-12">
                        {/* Image for Home Loan Tips */}
                        <img 
                            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                            alt="Home Loan Tips"
                            className="w-full h-64 object-cover"
                            onError={(e) => e.target.src = 'https://placehold.co/800x400/1E293B/FF0000?text=Image+Load+Error'}
                        />
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-brand-primary mb-4">Home Loan Guide 2025: Getting the Best Rates</h2>
                            <p className="text-text-muted mb-4 text-base leading-relaxed">
                                With changing economic conditions, home loan interest rates have seen significant fluctuations. Our comprehensive guide helps you navigate the current lending landscape and secure the best possible rates for your dream home.
                            </p>
                            <p className="text-text-muted mb-6 text-base leading-relaxed">
                                Learn about the latest RBI guidelines, compare offers from top banks and NBFCs, and understand how to improve your credit score for better loan eligibility. We also cover government schemes that can provide additional benefits to first-time home buyers.
                            </p>
                            <a href="#" className="text-brand-accent hover:underline font-semibold text-lg">
                                Read Guide &rarr;
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default ArticlesPage;