package buckets

import (
	"fmt"
	"log"
	"time"

	"github.com/boltdb/bolt"
	"github.com/timshannon/bolthold"

	"litefinga/config"
)

type Activations struct {
	ID, IDSync, Createdby, Updatedby   uint64
	Code, Title, Workflow, Description string
	Createdate, Updatedate             time.Time

	UserID uint64
	Vieweddate, Expirydate,
	Type string
}

func (this Activations) bucketName() string {
	return "Activations"
}

func (this Activations) Create(bucketType *Activations) (err error) {

	if err = config.Get().BoltHold.Bolt().Update(func(tx *bolt.Tx) error {

		if bucketType.Createdate.IsZero() {
			bucketType.Createdate = time.Now()
			bucketType.Updatedate = bucketType.Createdate
		}

		if bucketType.ID == 0 {
			bucket := tx.Bucket([]byte(this.bucketName()))
			bucketType.ID, _ = bucket.NextSequence()
			bucketType.Createdate = time.Now()
			bucketType.Createdby = bucketType.Updatedby
		} else {
			bucketType.Updatedate = time.Now()
		}

		err = config.Get().BoltHold.TxUpsert(tx, bucketType.ID, bucketType)
		return err
	}); err != nil {
		log.Printf(err.Error())
	}

	return
}

func (this Activations) List() (resultsALL []string) {
	var results []Activations

	if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
		err := config.Get().BoltHold.Find(&results, bolthold.Where("ID").Gt(uint64(0)))
		return err
	}); err != nil {
		log.Printf(err.Error())
	} else {
		for _, record := range results {
			resultsALL = append(resultsALL, fmt.Sprintf("%+v", record))
		}
	}

	return
}

func (this Activations) GetFieldValue(Field string, Value interface{}) (results []Activations, err error) {

	if len(Field) > 0 {
		if err = config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
			err = config.Get().BoltHold.Find(&results, bolthold.Where(Field).Eq(Value).SortBy("ID").Reverse())
			return err
		}); err != nil {
			log.Printf(err.Error())
		}
	}

	return
}
