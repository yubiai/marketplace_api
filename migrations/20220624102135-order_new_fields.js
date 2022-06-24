module.exports = {
  async up(db, client) {
    /**
     * TODO: Not ready yet!
     */
    await db.collection('orders')
      .updateMany(
        {},
        {
          $set: {
            "userSeller": { $first: "$items.0.seller.eth_address" },
            "itemId": { $first: "$items.0._id" }
          },
        }
      )

    await db.collection('orders')
      .updateMany(
        {},
        {
          $unset: {
            items: null
          }
        }
      )
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
