;; Risk Pool Contract

(define-data-var next-pool-id uint u0)

(define-map risk-pools
  { pool-id: uint }
  {
    name: (string-ascii 50),
    total-funds: uint,
    policy-count: uint,
    risk-factor: uint
  }
)

(define-public (create-risk-pool (name (string-ascii 50)) (initial-funds uint) (risk-factor uint))
  (let
    (
      (pool-id (var-get next-pool-id))
    )
    (map-set risk-pools
      { pool-id: pool-id }
      {
        name: name,
        total-funds: initial-funds,
        policy-count: u0,
        risk-factor: risk-factor
      }
    )
    (var-set next-pool-id (+ pool-id u1))
    (ok pool-id)
  )
)

(define-public (add-funds-to-pool (pool-id uint) (amount uint))
  (let
    (
      (pool (unwrap! (map-get? risk-pools { pool-id: pool-id }) (err u404)))
    )
    (map-set risk-pools
      { pool-id: pool-id }
      (merge pool { total-funds: (+ (get total-funds pool) amount) })
    )
    (ok true)
  )
)

(define-public (add-policy-to-pool (pool-id uint))
  (let
    (
      (pool (unwrap! (map-get? risk-pools { pool-id: pool-id }) (err u404)))
    )
    (map-set risk-pools
      { pool-id: pool-id }
      (merge pool { policy-count: (+ (get policy-count pool) u1) })
    )
    (ok true)
  )
)

(define-read-only (get-risk-pool (pool-id uint))
  (ok (unwrap! (map-get? risk-pools { pool-id: pool-id }) (err u404)))
)

