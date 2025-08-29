import React from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../ServiceSectionTemplate'

/**
 * Performance Equipment Section
 * Details about the professional setup and equipment
 */
export const PerformanceEquipment: React.FC<ServiceSectionProps> = React.memo(({
  className = '',
  animate = true,
}) => {
  const equipment = {
    guitars: [
      {
        name: 'Fender Stratocaster',
        type: 'Electric',
        use: 'Blues, Rock, Jazz',
      },
      { name: 'Gibson Les Paul', type: 'Electric', use: 'Blues, Rock' },
      { name: 'Martin Acoustic', type: 'Acoustic', use: 'Folk, Unplugged' },
    ],
    amplification: [
      {
        name: 'Fender Blues Deluxe',
        power: '40W Tube',
        use: 'Small-Medium Venues',
      },
      { name: 'Marshall JCM800', power: '100W', use: 'Large Venues' },
      { name: 'Line 6 Wireless', power: 'Digital', use: 'Freedom of Movement' },
    ],
    effects: [
      'Blues Driver Overdrive',
      'Tube Screamer',
      'Reverb & Delay',
      'Wah Pedal',
      'Chorus & Modulation',
    ],
  }

  return (
    <ServiceSectionTemplate
      serviceType="performance"
      title="Professional Equipment Setup"
      subtitle="High-quality gear ensuring exceptional sound at every performance"
      sectionId="performance-equipment"
      variant="default"
      background="gray"
      className={className}
      animate={animate}
    >
      <div className="equipment-sections grid lg:grid-cols-3 gap-8">
        {/* Guitars */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🎸
            </div>
            <h3 className="text-xl font-bold text-gray-900">Guitars</h3>
          </div>

          <div className="equipment-list space-y-4">
            {equipment.guitars.map((guitar, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg"
              >
                <div className="font-medium text-gray-900">{guitar.name}</div>
                <div className="text-sm text-gray-600">{guitar.type}</div>
                <div className="text-xs text-brand-blue-primary">
                  {guitar.use}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amplification */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔊
            </div>
            <h3 className="text-xl font-bold text-gray-900">Amplification</h3>
          </div>

          <div className="equipment-list space-y-4">
            {equipment.amplification.map((amp, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg"
              >
                <div className="font-medium text-gray-900">{amp.name}</div>
                <div className="text-sm text-gray-600">{amp.power}</div>
                <div className="text-xs text-brand-blue-primary">{amp.use}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Effects & Pedals
            </h3>
          </div>

          <div className="equipment-list space-y-2">
            {equipment.effects.map((effect, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg text-center"
              >
                <div className="font-medium text-gray-900 text-sm">
                  {effect}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Information */}
      <div className="setup-info mt-12 bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Complete Professional Setup
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              🎛️
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Sound Engineering
            </h4>
            <p className="text-sm text-gray-600">
              Professional sound mixing and level control
            </p>
          </div>
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              📡
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Wireless Freedom
            </h4>
            <p className="text-sm text-gray-600">
              Wireless guitar system for stage mobility
            </p>
          </div>
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              🔧
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Setup</h4>
            <p className="text-sm text-gray-600">
              Efficient setup and soundcheck process
            </p>
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
})

PerformanceEquipment.displayName = 'PerformanceEquipment'

export default PerformanceEquipment