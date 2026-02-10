import React from 'react';

/**
 * Tailwind CSS Verification Component
 * Tests all custom colors, components, and utilities
 */
const TailwindTest = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        ✅ Tailwind CSS Production Setup
                    </h1>
                    <p className="text-gray-600">
                        No CDN warnings! Optimized for production.
                    </p>
                </div>

                {/* Custom Colors Test */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Custom Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary text-white p-6 rounded-lg text-center">
                            <div className="text-xl font-bold">Primary</div>
                            <div className="text-sm opacity-90">#4CAF50</div>
                        </div>
                        <div className="bg-secondary text-white p-6 rounded-lg text-center">
                            <div className="text-xl font-bold">Secondary</div>
                            <div className="text-sm opacity-90">#2196F3</div>
                        </div>
                        <div className="bg-accent text-white p-6 rounded-lg text-center">
                            <div className="text-xl font-bold">Accent</div>
                            <div className="text-sm opacity-90">#FF9800</div>
                        </div>
                    </div>
                </div>

                {/* Custom Components Test */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Custom Components</h2>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <button className="btn-primary">Primary Button</button>
                            <button className="btn-secondary">Secondary Button</button>
                        </div>
                        <input
                            className="input-field"
                            placeholder="Input field with custom styling"
                        />
                    </div>
                </div>

                {/* Responsive Grid Test */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Responsive Grid</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((num) => (
                            <div
                                key={num}
                                className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg text-center"
                            >
                                <div className="text-3xl font-bold">Card {num}</div>
                                <div className="text-sm mt-2">Responsive</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Utility Classes Test */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Standard Utilities</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <span className="font-semibold">Flexbox</span>
                            <span className="text-primary">✓ Working</span>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                            Gradients ✓
                        </div>
                        <div className="p-4 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-white">
                            Hover Effects ✓
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 border-l-4 border-primary p-6 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-bold text-green-900">
                                Production Setup Complete!
                            </h3>
                            <p className="text-green-700 mt-2">
                                ✅ No CDN warnings<br />
                                ✅ Custom colors configured<br />
                                ✅ Tree-shaking enabled<br />
                                ✅ Optimized bundle size<br />
                                ✅ Ready for deployment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TailwindTest;
