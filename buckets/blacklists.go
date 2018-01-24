package buckets

import (
	"fmt"
	"log"
	"time"

	"github.com/boltdb/bolt"
	"github.com/timshannon/bolthold"

	"litefinga/config"
)

type Blacklists struct {
	ID, IDSync, Createdby, Updatedby   uint64
	Code, Title, Workflow, Description string
	Createdate, Updatedate             time.Time

	Url, Host, Cookie, Method, Useragent,
	Remoteaddr, Email, Mobile, Referrer,
	Username string

	Access bool
}

func (this Blacklists) bucketName() string {
	return "Blacklists"
}

func (this Blacklists) Create(bucketType *Blacklists) (err error) {

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

func (this Blacklists) List() (resultsALL []string) {
	var results []Blacklists

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

func (this Blacklists) GetFieldValue(Field string, Value interface{}) (results []Blacklists, err error) {
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
