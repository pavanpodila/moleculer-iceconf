module.exports = {
  nodeID: 'sub',
  transporter: 'kafka://localhost:9092',
  logger: true,
  metrics: true,
  tracing: {
    enabled: true,
    events: true,
    exporter: {
      type: 'Jaeger',
      host: 'localhost',
      port: 6832,
      sampler: {
        type: 'Const',
      },
    },
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};
