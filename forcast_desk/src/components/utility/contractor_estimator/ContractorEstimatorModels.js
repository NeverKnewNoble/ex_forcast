/**
 * Contractor Estimator Data Models
 * Based on Excel analysis for contractor estimation functionality
 */

export class ContractorEstimatorItem {
  constructor(data = {}) {
    this.id = data.id || this.generateId()
    this.lineId = data.lineId || null
    this.name = data.name || ''
    this.party = data.party || ''
    this.status = data.status || 'Not Started'
    this.percentComplete = data.percentComplete || 0
    this.projected = data.projected || 0
    this.actual = data.actual || 0
    this.currentPaid = data.currentPaid || 0
    this.comments = data.comments || ''
    
    // Calculated fields
    this.variance = this.calculateVariance()
    this.amountDue = this.calculateAmountDue()
  }

  generateId() {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  calculateVariance() {
    return (this.actual || 0) - (this.projected || 0)
  }

  calculateAmountDue() {
    return (this.actual || 0) - (this.currentPaid || 0)
  }

  updateCalculatedFields() {
    this.variance = this.calculateVariance()
    this.amountDue = this.calculateAmountDue()
  }

  validate() {
    const errors = []
    
    if (!this.name.trim()) {
      errors.push('Item name is required')
    }
    
    if (this.percentComplete < 0 || this.percentComplete > 100) {
      errors.push('Percent complete must be between 0 and 100')
    }
    
    if (this.currentPaid > this.actual) {
      errors.push('Current paid cannot exceed actual amount')
    }
    
    return errors
  }

  toJSON() {
    return {
      id: this.id,
      lineId: this.lineId,
      name: this.name,
      party: this.party,
      status: this.status,
      percentComplete: this.percentComplete,
      projected: this.projected,
      actual: this.actual,
      currentPaid: this.currentPaid,
      comments: this.comments,
      variance: this.variance,
      amountDue: this.amountDue
    }
  }

  static createEmpty(name = '') {
    return new ContractorEstimatorItem({ name })
  }
}

export class ContractorEstimatorCategory {
  constructor(data = {}) {
    this.id = data.id || this.generateId()
    this.name = data.name || ''
    this.order = data.order || 0
    this.items = (data.items || []).map(item => 
      item instanceof ContractorEstimatorItem ? item : new ContractorEstimatorItem(item)
    )
    
    // Calculated subtotals
    this.subtotals = this.calculateSubtotals()
  }

  generateId() {
    return `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  calculateSubtotals() {
    const subtotals = {
      projected: 0,
      actual: 0,
      variance: 0,
      currentPaid: 0,
      amountDue: 0
    }

    this.items.forEach(item => {
      item.updateCalculatedFields()
      subtotals.projected += item.projected || 0
      subtotals.actual += item.actual || 0
      subtotals.variance += item.variance || 0
      subtotals.currentPaid += item.currentPaid || 0
      subtotals.amountDue += item.amountDue || 0
    })

    return subtotals
  }

  addItem(itemData = {}) {
    const newItem = new ContractorEstimatorItem(itemData)
    this.items.push(newItem)
    this.updateSubtotals()
    return newItem
  }

  removeItem(itemId) {
    const index = this.items.findIndex(item => item.id === itemId)
    if (index > -1) {
      this.items.splice(index, 1)
      this.updateSubtotals()
      return true
    }
    return false
  }

  updateSubtotals() {
    this.subtotals = this.calculateSubtotals()
  }

  validate() {
    const errors = []
    
    if (!this.name.trim()) {
      errors.push('Category name is required')
    }
    
    this.items.forEach((item, index) => {
      const itemErrors = item.validate()
      if (itemErrors.length > 0) {
        errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`)
      }
    })
    
    return errors
  }

  toJSON() {
    // Filter out items that have no meaningful data
    const itemsWithData = this.items.filter(item => {
      // Only keep items that have actual data (not just a name)
      return item.projected > 0 || 
             item.actual > 0 || 
             item.currentPaid > 0 || 
             (item.comments && item.comments.trim() !== '') ||
             (item.party && item.party.trim() !== '') ||
             item.status !== 'Not Started' ||
             item.percentComplete > 0
    })

    return {
      id: this.id,
      name: this.name,
      order: this.order,
      items: itemsWithData.map(item => item.toJSON()),
      subtotals: this.subtotals
    }
  }

  static createEmpty(name = '', order = 0) {
    return new ContractorEstimatorCategory({ name, order })
  }
}

export class ContractorEstimator {
  constructor(data = {}) {
    this.id = data.id || this.generateId()
    this.projectTitle = data.projectTitle || ''
    this.location = data.location || ''
    this.project = data.project || ''
    this.categories = (data.categories || []).map(category => 
      category instanceof ContractorEstimatorCategory ? category : new ContractorEstimatorCategory(category)
    )
    
    // Calculated totals
    this.totals = this.calculateTotals()
  }

  generateId() {
    return `estimator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  calculateTotals() {
    const totals = {
      projected: 0,
      actual: 0,
      variance: 0,
      currentPaid: 0,
      amountDue: 0
    }

    this.categories.forEach(category => {
      category.updateSubtotals()
      totals.projected += category.subtotals.projected
      totals.actual += category.subtotals.actual
      totals.variance += category.subtotals.variance
      totals.currentPaid += category.subtotals.currentPaid
      totals.amountDue += category.subtotals.amountDue
    })

    return totals
  }

  addCategory(categoryData = {}) {
    const newCategory = new ContractorEstimatorCategory(categoryData)
    this.categories.push(newCategory)
    this.updateTotals()
    return newCategory
  }

  removeCategory(categoryId) {
    const index = this.categories.findIndex(category => category.id === categoryId)
    if (index > -1) {
      this.categories.splice(index, 1)
      this.updateTotals()
      return true
    }
    return false
  }

  updateTotals() {
    this.totals = this.calculateTotals()
  }

  validate() {
    const errors = []
    
    if (!this.projectTitle.trim()) {
      errors.push('Project title is required')
    }
    
    this.categories.forEach((category, index) => {
      const categoryErrors = category.validate()
      if (categoryErrors.length > 0) {
        errors.push(`Category ${index + 1} (${category.name}): ${categoryErrors.join(', ')}`)
      }
    })
    
    return errors
  }

  toJSON() {
    return {
      id: this.id,
      projectTitle: this.projectTitle,
      location: this.location,
      project: this.project,
      categories: this.categories.map(category => category.toJSON()),
      totals: this.totals
    }
  }

  static createEmpty(projectTitle = '', location = '') {
    return new ContractorEstimator({ projectTitle, location })
  }

  // COMMENTED OUT: Default categories creation - now using API data instead
  // static createWithDefaultCategories(projectTitle = '', location = '') {
  //   const estimator = new ContractorEstimator({ projectTitle, location })
  //   
  //   // Add default categories with their items based on Excel analysis
  //   const defaultCategories = [
  //     'Planning',
  //     'Site Prep',
  //     'Earthwork / Excavation',
  //     'Utilities',
  //     'Water + Sewer',
  //     'Foundation',
  //     'Rough Framing',
  //     'Windows + Doors (Exterior)',
  //     'Finish - Exterior',
  //     'Roofing',
  //     'Masonry / Paving',
  //     'Porches + Decks',
  //     'Insulation + Air Sealing',
  //     'Plumbing',
  //     'Electrical',
  //     'HVAC',
  //     'Drywall + Plaster',
  //     'Finish - Interior',
  //     'Kitchen',
  //     'Bath',
  //     'Appliances',
  //     'Other'
  //   ]

  //   defaultCategories.forEach((name, index) => {
  //     const category = estimator.addCategory({ name, order: index + 1 })
  //     
  //     // Add default items for this category
  //     const defaultItems = DEFAULT_CATEGORY_ITEMS[name] || []
  //     defaultItems.forEach(itemName => {
  //       category.addItem({ name: itemName })
  //     })
  //   })

  //   return estimator
  // }
}

// Status options for dropdowns
export const STATUS_OPTIONS = [
  'Not Started',
  'In Progress', 
  'Complete',
  'On Hold'
]

// COMMENTED OUT: Default items per category - now using API data instead
/*
export const DEFAULT_CATEGORY_ITEMS = {
  'Planning': [
    'Admin Fees',
    'Engineering',
    'Financing Costs',
    'Legal',
    'Permit - Building',
    'Permit - Environmental',
    'Permit - Zoning',
    'Plans + Specs',
    'Review',
    'Survey'
  ],
  'Site Prep': [
    'Dumpster / Waste Removal',
    'Equipment Rental',
    'Lot Clearing',
    'Portable Restroom Facilities',
    'Remodel - Demo',
    'Remodel - Dust Control',
    'Remodel - Jacking + Shoring',
    'Remodel - Surface Protection',
    'Scaffolding Rental',
    'Site Access',
    'Site Security',
    'Site Storage',
    'Temporary Heat',
    'Temporary Power',
    'Tool Rental'
  ],
  'Earthwork / Excavation': [
    'Backfill',
    'Blasting',
    'Compaction',
    'Culverts',
    'Curtain Drains',
    'Cut + Fill',
    'Dirt + Stone Removal',
    'Finish Grading',
    'Foundation - Excavation',
    'Foundation - Footing Drains',
    'Ponds',
    'Retaining Walls',
    'Rough Grading',
    'Seeding / Sodding',
    'Site Drainage - Additional',
    'Swales',
    'Top Soil'
  ],
  'Utilities': [
    'Electrical - Connection',
    'Electrical - Install',
    'Electrical - Permit',
    'Gas - Connection',
    'Gas - Hookup',
    'Gas - Permit',
    'Oil Tank Install',
    'Sewer - Tap Fees & Hookup',
    'Telecom - Hookup',
    'Telecom - Install',
    'Water - Tap Fees & Hookup'
  ],
  'Water + Sewer': [
    'High Water Table Dewatering',
    'Perc Test',
    'Plumbing to House',
    'Pressure Tank',
    'Pump',
    'Septic - Design',
    'Septic - Fees',
    'Septic - Inspection',
    'Septic - Permits',
    'Septic - Tie to House',
    'Soil Test',
    'Trenching',
    'Well',
    'Well - Fees',
    'Well - Permits'
  ],
  'Foundation': [
    'Anchor Bolts',
    'Bulkheads',
    'Crawlspace Vapor Barrier',
    'Crawlspace Vents',
    'Damp Proofing',
    'Exterior Foundation Insulation',
    'Exterior Insulation Coating',
    'Footings',
    'Foundation - Drain Board',
    'Foundation - Walls',
    'Foundation - Windows',
    'Grade Beams',
    'Hold Downs',
    'Pads',
    'Piers',
    'Slab - Basement',
    'Slab - Foundation',
    'Slab - Garage',
    'Slab Insulation',
    'Steel Reinforcing',
    'Stem Walls',
    'Sub-Slab Vapor Barrier',
    'Sump Pump',
    'Waterproofing'
  ],
  'Rough Framing': [
    'Exterior Walls',
    'Fasteners / Nails / Screws',
    'Floor Framing',
    'Interior Walls',
    'Lally Columns',
    'Plaster / Drywall Prep',
    'Roof Framing / Trusses',
    'Rough Stairs',
    'Sheathing',
    'Sill + Seal',
    'Steel / Wood Carrying Beam',
    'Steel Framing Connectors',
    'Sub-Fascia',
    'Subflooring',
    'Labor Costs'
  ],
  'Windows + Doors (Exterior)': [
    'Exterior Door - Frames + Sills',
    'Exterior Door - Hardware',
    'Exterior Door - Prehung',
    'Exterior Door - Slabs',
    'Garage Doors',
    'Membrane + Flashing',
    'Sidelights',
    'Sliding / Hinged Doors',
    'Transoms',
    'Windows',
    'Labor Costs'
  ],
  'Finish - Exterior': [
    'Foam Sheathing',
    'Weather Barrier',
    'Membrane + Flashing',
    'Siding',
    'Veneer',
    'Stucco',
    'Fascia',
    'Soffit',
    'Frieze',
    'Corner Boards',
    'Water Table',
    'Soffit / Gable Vents',
    'Trim - Windows',
    'Trim - Doors',
    'Trim - Finishing',
    'Stairs',
    'Landing',
    'Paint',
    'Stain',
    'Caulk',
    'Labor Costs'
  ],
  'Roofing': [
    'Drip Edge',
    'Gutters + Downspouts',
    'Installation / Labor',
    'Membrane + Flashing',
    'Ridge & Roof Vents',
    'Skylights',
    'Underlayment'
  ],
  'Masonry / Paving': [
    'Driveway',
    'Walkways',
    'Chimneys',
    'Stairs - Exterior',
    'Patios',
    'Fireplaces + Hearths'
  ],
  'Porches + Decks': [
    'Porch - Open',
    'Porch - Screened',
    'Deck - Composite',
    'Deck - Wood',
    'Fencing',
    'Railings',
    'Outdoor Built-Ins',
    'Additional Structures'
  ],
  'Insulation + Air Sealing': [
    'Air Sealing',
    'Blower Door',
    'Infrared',
    'Insulation - Basement Interior',
    'Insulation - Crawlspace',
    'Insulation - Foam Board',
    'Insulation - Roof / Attic',
    'Insulation - Spray Foam',
    'Insulation - Wall Cavity',
    'Roof / Eave Baffles'
  ],
  'Plumbing': [
    'Drain',
    'Waste',
    'Vent',
    'Piping - Water Supply',
    'Piping - Gas',
    'Water Heater',
    'Water Treatment',
    'Toilets',
    'Tubs',
    'Sinks',
    'Showers',
    'Faucets',
    'Mixing Valves',
    'Shower Heads',
    'Disposal'
  ],
  'Electrical': [
    'Service Panels',
    'Sub-Panels',
    'Rough Wiring',
    'Phone / Cable / Internet Wiring',
    'Lighting Fixtures',
    'Low-Voltage Fixtures',
    'Low-Voltage Transformers',
    'Outlets',
    'Switches',
    'Dimmers',
    'Lighting Control System',
    'Doorbell',
    'Smoke + CO2 Alarms',
    'Intercom System',
    'Security System',
    'Home Theater',
    'Home Entertainment System'
  ],
  'HVAC': [
    'Air Handler',
    'Boiler',
    'Central AC',
    'Ductwork',
    'Furnace / Heat Pump',
    'Grilles',
    'HVAC Controls',
    'Piping',
    'Radiators',
    'Registers',
    'Solar Hot Water',
    'Whole-House Ventilation'
  ],
  'Drywall + Plaster': [
    'Walls',
    'Ceilings',
    'Soffits',
    'Decorative Plaster',
    'Labor Costs'
  ],
  'Finish - Interior': [
    'Built-In Cabinets',
    'Built-In Shelving',
    'Ceilings - Function',
    'Ceilings - Decorative',
    'Closet Hardware',
    'Closet Shelving',
    'Flooring - Carpet',
    'Flooring - Tile / Stone Materials',
    'Flooring - Tile / Stone Prep',
    'Flooring - Vinyl',
    'Flooring - Wood',
    'Interior Door - Frames + Thresholds',
    'Interior Door - Hardware',
    'Interior Door - Prehung',
    'Interior Door - Slabs',
    'Interior Paint',
    'Interior Stain',
    'Paneling',
    'Stairs / Railings / Newels',
    'Wainscoting',
    'Labor Costs'
  ],
  'Kitchen': [
    'Accessories',
    'Backsplash',
    'Built-Ins',
    'Cabinets',
    'Cabinets - Hardware',
    'Countertops',
    'Shelving',
    'Tile / Stone',
    'Labor Costs'
  ],
  'Bath': [
    'Accessories',
    'Backsplash',
    'Built-Ins',
    'Cabinets',
    'Cabinets - Hardware',
    'Countertops',
    'Medicine Cabinets',
    'Mirrors',
    'Raised Tub Platform',
    'Shelving',
    'Shower Enclosure',
    'Tile / Stone',
    'Tub Enclosure',
    'Labor Costs'
  ],
  'Appliances': [
    'Cooktop',
    'Deep Freeze',
    'Dishwasher',
    'Microwave Oven',
    'Oven',
    'Range Hood',
    'Refrigerator',
    'Washer + Dryer'
  ],
  'Other': []
}
*/
