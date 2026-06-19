export const TEMPLATES = [
  { name: 'Arjun Mehta',  age: 67, bed: 'ICU-01', gender: 'M', condition: 'Post-Cardiac Surgery' },
  { name: 'Priya Sharma', age: 54, bed: 'ICU-02', gender: 'F', condition: 'Respiratory Failure' },
  { name: 'Ravi Kumar',   age: 72, bed: 'ICU-03', gender: 'M', condition: 'Severe Pneumonia' },
  { name: 'Lakshmi Devi', age: 45, bed: 'ICU-04', gender: 'F', condition: 'Septic Shock' },
  { name: 'Anil Verma',   age: 61, bed: 'ICU-05', gender: 'M', condition: 'ARDS' },
  { name: 'Sunita Patel', age: 38, bed: 'ICU-06', gender: 'F', condition: 'Traumatic Brain Injury' },
  { name: 'Mohan Singh',  age: 80, bed: 'ICU-07', gender: 'M', condition: 'Multi-Organ Failure' },
  { name: 'Kavitha Rao',  age: 29, bed: 'ICU-08', gender: 'F', condition: 'Post-Surgery Recovery' },
]

export const NR = {
  hr:   { min: 60,   max: 100,  cMin: 40,  cMax: 130, unit: 'BPM'  },
  spo2: { min: 95,   max: 100,  cMin: 85,  cMax: 100, unit: '%'    },
  temp: { min: 36.1, max: 37.2, cMin: 35,  cMax: 39.5,unit: '°C'  },
  sbp:  { min: 90,   max: 130,  cMin: 70,  cMax: 180, unit: ''     },
  dbp:  { min: 60,   max: 90,   cMin: 40,  cMax: 120, unit: ''     },
  rr:   { min: 12,   max: 20,   cMin: 6,   cMax: 30,  unit: '/min' },
}

export const CHART_COLORS = [
  '#00f5ff','#ff6680','#00ff88','#aa88ff',
  '#ffcc00','#ff6600','#4488ff','#ff88aa',
]

export const RICON = {
  'Doctor / Intensivist': '👨‍⚕️',
  'Head Nurse':           '👩‍⚕️',
  'Staff Nurse':          '👩‍⚕️',
  'Resident Doctor':      '🧑‍⚕️',
  'Pharmacist':           '💊',
  'Physiotherapist':      '🦾',
  'Radiologist':          '🔬',
  'Lab Technician':       '🧪',
  'Admin Staff':          '🗂️',
}

export const BT_DEVICES = [
  { name: 'MedSense HR-200',      type: 'Heart Rate Monitor', sig: -62 },
  { name: 'OxyPulse MAX30102',    type: 'SpO2 Sensor',        sig: -55 },
  { name: 'CuffMate BPM Pro',     type: 'Blood Pressure',     sig: -70 },
  { name: 'ThermaLink v2',        type: 'Temperature Sensor', sig: -48 },
  { name: 'ESP32 ICU Node',       type: 'Multi-Sensor Hub',   sig: -60 },
  { name: 'Ventilator BT Gateway',type: 'Ventilator Data',    sig: -75 },
]

export const AI_RECS = {
  highHR:   ['Consider beta-blocker administration','Evaluate for pain, anxiety, or fever','12-lead ECG recommended','Check fluid status'],
  lowHR:    ['Evaluate for heart block or arrhythmia','Consider atropine if symptomatic','Check current medications','Temporary pacing may be needed'],
  lowSpO2:  ['Increase FiO₂ immediately','Check airway patency','ABG analysis recommended','Consider prone positioning','Review ventilator settings'],
  highTemp: ['Blood cultures before antibiotics','Antipyretic therapy (paracetamol)','CBC and CRP labs','Review infection source'],
  highBP:   ['Titrate antihypertensive therapy','Ensure adequate pain control','Check for increased ICP'],
  lowBP:    ['IV fluid bolus 500mL normal saline','Vasopressor support (Norepinephrine)','Evaluate for sepsis'],
  highRR:   ['Check for pulmonary embolism','Chest X-ray','Optimize mechanical ventilation'],
}