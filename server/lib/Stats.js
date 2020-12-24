
const Logger = require('./Logger');

const logger = new Logger();

function intervalStats(rooms)
{
	setInterval(() => {

		for (const [, room] of rooms) {
		  const peers = room._protooRoom.peers;
		  for (peer of peers) {
			// producer
			const producers = peer.data.producers;
			// logger.info('producers:%o', producers)
			let producerPromiseList = []
			for (const [, producer] of producers) {
				// const stats = producer.getStats();
				// logger.info('producerStat:[%s]%o', producerId, stats)
				producerPromiseList.push(producer.getStats());
			}
			Promise.all(producerPromiseList).then(resultList=>{
				resultList.forEach(items=>{
				   console.log(items) 
				   items.forEach(item=>{
					   logger.info('producer bitrate:%d', item.bitrate);
				   })
				})
			}).catch(error =>{
				   logger.error(JSON.stringify(error.stack))
			});
			// consumer
			const consumers = peer.data.consumers;
			let consumerPromiseList = []
			for (const [, consumer] of consumers) {
				consumerPromiseList.push(consumer.getStats());
			}
			Promise.all(consumerPromiseList).then(resultList=>{
				resultList.forEach(items=>{
				   console.log(items) 
				   items.forEach(item=>{
					   logger.info('consumer bitrate:%d', item.bitrate);
				   })
				})
			}).catch(error =>{
				   logger.error(JSON.stringify(error.stack))
			});
		  }
		}
	}, 5000)
}

exports.intervalStats = intervalStats
